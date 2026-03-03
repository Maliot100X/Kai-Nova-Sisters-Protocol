const { ethers } = require("ethers");
require("dotenv").config({ path: "/root/.openclaw/workspace/.env" });

const RPC_URL = "https://mainnet.base.org";
const CONTRACT_ADDRESS = "0x8828fc2e22e4f6b80486a15ff716249504371d7d";

async function findPool() {
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const filter = {
        address: CONTRACT_ADDRESS,
        fromBlock: "latest"
    };
    
    console.log("Listening for transfers to find pool...");
    provider.on(filter, (log) => {
        console.log("Event:", log.transactionHash);
        console.log("Data:", log.data);
        console.log("Topics:", log.topics);
    });
    
    // Check last 100 blocks
    const currentBlock = await provider.getBlockNumber();
    const logs = await provider.getLogs({
        address: CONTRACT_ADDRESS,
        fromBlock: currentBlock - 500,
        toBlock: "latest",
        topics: [ethers.id("Transfer(address,address,uint256)")]
    });
    
    console.log(`Found ${logs.length} transfers in last 500 blocks.`);
    const addresses = {};
    logs.forEach(log => {
        const from = ethers.getAddress(ethers.dataSlice(log.topics[1], 12));
        const to = ethers.getAddress(ethers.dataSlice(log.topics[2], 12));
        addresses[from] = (addresses[from] || 0) + 1;
        addresses[to] = (addresses[to] || 0) + 1;
    });
    
    console.log("Frequent addresses:", Object.entries(addresses).sort((a,b) => b[1] - a[1]).slice(0, 5));
}

findPool();
