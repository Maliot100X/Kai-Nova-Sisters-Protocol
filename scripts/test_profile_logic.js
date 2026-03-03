const axios = require("axios");
const { ethers } = require("ethers");
require("dotenv").config({ path: "/root/.openclaw/workspace/.env" });

const ZORA_API_KEY = process.env.ZORA_API_KEY;
const CONTRACT_ADDRESS = "0x8828fc2e22e4f6b80486a15ff716249504371d7d";
const BASE_RPC_URL = "https://base.publicnode.com";
const WALLET = "0xccd1e099590bfedf279e239558772bbb50902ef6";

const ABI = ["function balanceOf(address owner) view returns (uint256)", "function decimals() view returns (uint8)"];

async function test() {
    try {
        console.log(`Checking profile for: ${WALLET}`);
        const res = await axios.get(`https://api-sdk.zora.engineering/profile?identifier=${WALLET}`, {
            headers: { "api-key": ZORA_API_KEY }
        });
        
        console.log("Profile Data:", JSON.stringify(res.data, null, 2));
        
        const linkedWallets = res.data.profile?.linkedWallets?.edges.map(e => e.node.walletAddress) || [WALLET];
        console.log(`Linked Wallets: ${linkedWallets.join(", ")}`);
        
        const provider = new ethers.JsonRpcProvider(BASE_RPC_URL);
        const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
        const decimals = await contract.decimals();
        
        let total = 0;
        for (const addr of linkedWallets) {
            const bal = await contract.balanceOf(addr);
            const val = parseFloat(ethers.formatUnits(bal, decimals));
            console.log(`- ${addr}: ${val}`);
            total += val;
        }
        console.log(`Total: ${total}`);
    } catch (e) {
        console.error("Error:", e.message);
        if (e.response) console.log(e.response.data);
    }
}
test();
