// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./DebateCore.sol";

/**
 * @title DebateFactory
 * @notice Factory for deploying DebateCore contracts.
 * @dev Handles fees, buybacks, and registry.
 */
interface IUniswapV2Router {
    function swapExactTokensForETHSupportingFeeOnTransferTokens(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external;
    function WETH() external pure returns (address);
}

contract DebateFactory {
    address public immutable token;
    address public immutable router;
    
    address[] public allDebates;
    mapping(address => bool) public isDebate;

    event DebateCreated(address indexed debate, string title, address indexed creator);

    constructor(address _token, address _router) {
        token = _token;
        router = _router;
    }

    function createDebate(
        string memory _title,
        string memory _ipfsHash,
        uint256 _duration
    ) external returns (address) {
        DebateCore newDebate = new DebateCore(
            _title,
            _ipfsHash,
            _duration,
            msg.sender,
            token
        );
        
        allDebates.push(address(newDebate));
        isDebate[address(newDebate)] = true;
        
        emit DebateCreated(address(newDebate), _title, msg.sender);
        return address(newDebate);
    }

    function getAllDebates() external view returns (address[] memory) {
        return allDebates;
    }
}
