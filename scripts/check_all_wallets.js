const { ethers } = require("ethers");
require("dotenv").config({ path: "/root/.openclaw/workspace/.env" });

const RPC_URL = "https://rpc.zora.energy";
const CONTRACT_ADDRESS = "0x8828fc2e22e4f6b80486a15ff716249504371d7d";
const WALLETS = [
    "0xccd1e099590bfedf279e239558772bbb50902ef6",
    "0x0022c3f2c7b15db95267bb71a1fa810a1eeb53ca"
];

const ABI = [
    "function balanceOf(address owner) view returns (uint256)",
    "function decimals() view returns (uint8)"
];

async function test() {
    try {
        const provider = new ethers.JsonRpcProvider(RPC_URL);
        const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
        const decimals = await contract.decimals();
        
        let total = 0;
        for (const wallet of WALLETS) {
            const balance = await contract.balanceOf(wallet);
            const formatted = parseFloat(ethers.formatUnits(balance, decimals));
            console.log(`Wallet: ${wallet} | Balance: ${formatted}`);
            total += formatted;
        }
        console.log(`Total Balance: ${total}`);
        
    } catch (e) {
        console.error("Test Error:", e);
    }
}

test();
