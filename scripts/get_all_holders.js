const { ethers } = require("ethers");
require("dotenv").config({ path: "/root/.openclaw/workspace/.env" });

const RPC_URL = "https://base.publicnode.com";
const CONTRACT_ADDRESS = "0x8828fc2e22e4f6b80486a15ff716249504371d7d";

const ABI = [
    "function balanceOf(address owner) view returns (uint256)",
    "function decimals() view returns (uint8)"
];

async function test() {
    try {
        const provider = new ethers.JsonRpcProvider(RPC_URL);
        const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
        const decimals = await contract.decimals();
        
        console.log("Fetching logs...");
        const currentBlock = await provider.getBlockNumber();
        const logs = await provider.getLogs({
            address: CONTRACT_ADDRESS,
            fromBlock: currentBlock - 10000,
            toBlock: "latest",
            topics: [ethers.id("Transfer(address,address,uint256)")]
        });
        
        console.log(`Found ${logs.length} transfers.`);
        const holders = {};
        logs.forEach(log => {
            const from = ethers.getAddress(ethers.dataSlice(log.topics[1], 12));
            const to = ethers.getAddress(ethers.dataSlice(log.topics[2], 12));
            const value = ethers.formatUnits(log.data, decimals);
            console.log(`Transfer to ${to}: ${value}`);
            
            holders[from] = (holders[from] || 0) - parseFloat(value);
            holders[to] = (holders[to] || 0) + parseFloat(value);
        });
        
        console.log("Holders with balance > 0:");
        Object.entries(holders).forEach(([addr, bal]) => {
            if (bal > 0.0001) console.log(`${addr}: ${bal}`);
        });
        
    } catch (e) {
        console.error("Test Error:", e);
    }
}

test();
