const { ethers } = require("ethers");
require("dotenv").config({ path: "/root/.openclaw/workspace/.env" });

const RPC_URL = "https://base.publicnode.com";
const CONTRACT_ADDRESS = "0x8828fc2e22e4f6b80486a15ff716249504371d7d";
const WALLET_ADDRESS = "0x0022c3f2c7b15db95267bb71a1fa810a1eeb53ca";

const ABI = ["function balanceOf(address owner) view returns (uint256)", "function decimals() view returns (uint8)"];

async function test() {
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ["function totalSupply() view returns (uint256)", "function decimals() view returns (uint8)"], provider);
    const supply = await contract.totalSupply();
    const dec = await contract.decimals();
    console.log(`Total Supply: ${ethers.formatUnits(supply, dec)}`);
}
test();
