// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title DebateCore
 * @notice Logic for individual debates in the Kai & Nova Protocol.
 * @dev Enforces strict state transitions and safety checks.
 */
contract DebateCore {
    struct DebateStruct {
        string title;
        string ipfsHash; // Argument/Description storage
        address creator;
        uint256 endTime;
        uint256 yesPool;
        uint256 noPool;
        uint256 totalPool;
        bool resolved;
        bool winningSide; // false = NO, true = YES
    }

    DebateStruct public debate;
    address public factory;
    address public token; // The KNTWS ERC-20 Token
    
    mapping(address => uint256) public stakeYes;
    mapping(address => uint256) public stakeNo;
    mapping(address => bool) public hasClaimed;

    event StakePlaced(address indexed user, bool side, uint256 amount, uint256 fid);
    event ArgumentSubmitted(address indexed user, string ipfsHash);
    event DebateResolved(bool winningSide);
    event RewardClaimed(address indexed user, uint256 amount);

    modifier onlyFactory() {
        require(msg.sender == factory, "Only Factory");
        _;
    }

    constructor(
        string memory _title,
        string memory _ipfsHash,
        uint256 _duration,
        address _creator,
        address _token
    ) {
        factory = msg.sender;
        token = _token;
        
        debate.title = _title;
        debate.ipfsHash = _ipfsHash;
        debate.creator = _creator;
        debate.endTime = block.timestamp + _duration;
        debate.resolved = false;
    }

    function stake(bool _side, uint256 _amount, uint256 _fid) external {
        require(block.timestamp < debate.endTime, "Debate ended: Staking closed");
        require(_amount > 0, "Amount must be > 0");
        
        // Transfer tokens from user to this contract
        // Requires approval on the ERC-20 token first
        (bool success, bytes memory data) = token.call(
            abi.encodeWithSignature("transferFrom(address,address,uint256)", msg.sender, address(this), _amount)
        );
        require(success && (data.length == 0 || abi.decode(data, (bool))), "Transfer failed: Check Allowance/Balance");

        if (_side) {
            stakeYes[msg.sender] += _amount;
            debate.yesPool += _amount;
        } else {
            stakeNo[msg.sender] += _amount;
            debate.noPool += _amount;
        }
        debate.totalPool += _amount;

        emit StakePlaced(msg.sender, _side, _amount, _fid);
    }

    function resolve(bool _winningSide) external {
        // In this version, resolution is permissionless after 2x duration (fallback)
        // or centralized via Oracle/Factory before then. 
        // For simplicity/strictness requested: Factory controls resolution via Oracle.
        require(msg.sender == factory, "Only Factory can resolve"); 
        require(block.timestamp >= debate.endTime, "Cannot resolve before endTime");
        require(!debate.resolved, "Already resolved");

        debate.winningSide = _winningSide;
        debate.resolved = true;

        emit DebateResolved(_winningSide);
    }

    function claim() external {
        require(debate.resolved, "Not resolved yet");
        require(!hasClaimed[msg.sender], "Already claimed");

        uint256 userStake;
        uint256 winnerPool;
        uint256 loserPool;

        if (debate.winningSide) {
            userStake = stakeYes[msg.sender];
            winnerPool = debate.yesPool;
            loserPool = debate.noPool;
        } else {
            userStake = stakeNo[msg.sender];
            winnerPool = debate.noPool;
            loserPool = debate.yesPool;
        }

        require(userStake > 0, "No stake in winning side");

        // Calculate Reward: Original Stake + Share of Loser Pool
        // Share = (UserStake / WinnerPool) * LoserPool
        uint256 profit = (userStake * loserPool) / winnerPool;
        uint256 totalPayout = userStake + profit;

        hasClaimed[msg.sender] = true;

        // Transfer Payout
        (bool success, bytes memory data) = token.call(
            abi.encodeWithSignature("transfer(address,uint256)", msg.sender, totalPayout)
        );
        require(success && (data.length == 0 || abi.decode(data, (bool))), "Payout transfer failed");

        emit RewardClaimed(msg.sender, totalPayout);
    }
    
    // Allow external agents/users to submit arguments on-chain for indexing
    function submitArgument(string memory _ipfsHash) external {
        require(block.timestamp < debate.endTime, "Debate ended");
        emit ArgumentSubmitted(msg.sender, _ipfsHash);
    }
}
