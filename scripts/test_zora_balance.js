const { ethers } = require("ethers");
require("dotenv").config({ path: "/root/.openclaw/workspace/.env" });

const RPC_URL = "https://mainnet.base.org";
const CONTRACT_ADDRESS = "0x8828fc2e22e4f6b80486a15ff716249504371d7d";
const WALLET_ADDRESS = "0xc8d077444625eb300a427a6dfb2b1dbf9b159040";

const ABI = [
    "function balanceOf(address owner) view returns (uint256)",
    "function decimals() view returns (uint8)",
    "function symbol() view returns (string)",
    "function name() view returns (string)"
];

async function test() {
    try {
        console.log("Connecting to RPC:", RPC_URL);
        const provider = new ethers.JsonRpcProvider(RPC_URL);
        const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
        
        console.log("Fetching metadata...");
        const name = await contract.name();
        const symbol = await contract.symbol();
        const decimals = await contract.decimals();
        console.log(`Token: ${name} (${symbol}) | Decimals: ${decimals}`);
        
        console.log("Fetching balance for:", WALLET_ADDRESS);
        const balance = await contract.balanceOf(WALLET_ADDRESS);
        const formatted = ethers.formatUnits(balance, decimals);
        console.log(`Balance: ${formatted} tokens`);
        
    } catch (e) {
        console.error("Test Error:", e);
    }
}

test();
