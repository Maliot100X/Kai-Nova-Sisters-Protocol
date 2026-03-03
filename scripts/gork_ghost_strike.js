const { Connection, Keypair, VersionedTransaction } = require('@solana/web3.js');
const bs58 = require('bs58');
const fetch = require('node-fetch');
const fs = require('fs');
const FormData = require('form-data');

// Configuration
// Using H3p5...SkwL as the default strike wallet
const PRIVATE_KEY = '4itijSkmCMQpP6MBsF76FQzjgo67uGM93SuYgNoXA497NNcnCkLGEcX8wPgNnkcnD2mvazTEP553GJWtnvAj63LN';
const RPC_URL = 'https://api.mainnet-beta.solana.com';
const IMAGE_PATH = '/root/.openclaw/media/inbound/04908f3b-030b-4a39-b455-83f598710c9f.jpg';

async function launchGork() {
    const signerKeyPair = Keypair.fromSecretKey(bs58.decode(PRIVATE_KEY));
    const mintKeypair = Keypair.generate();
    
    console.log(`🚀 Initiating GORK Ghost Strike...`);
    console.log(`💎 Mint: ${mintKeypair.publicKey.toBase58()}`);

    try {
        // 1. Upload to IPFS
        console.log("📤 Uploading IPFS...");
        const formData = new FormData();
        formData.append("file", fs.createReadStream(IMAGE_PATH));
        formData.append("name", "GORK");
        formData.append("symbol", "GORK");
        formData.append("description", "GORK. Precise strike. Infrastructure scout. The void driller's choice.");
        formData.append("twitter", "https://x.com/gork");
        formData.append("website", "https://kainova.xyz");
        formData.append("showName", "true");

        const ipfsResponse = await fetch("https://pumpportal.fun/ipfs", {
            method: "POST",
            body: formData
        });

        if (ipfsResponse.status !== 200) {
            console.log(`❌ IPFS Failed: ${await ipfsResponse.text()}`);
            return;
        }

        const ipfsData = await ipfsResponse.json();
        console.log(`✅ IPFS Metadata: ${ipfsData.metadataUri}`);

        // 2. Create Transaction (0 SOL buy)
        console.log("📦 Creating local transaction...");
        const response = await fetch(`https://pumpportal.fun/api/trade-local`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "publicKey": signerKeyPair.publicKey.toBase58(),
                "action": "create",
                "tokenMetadata": {
                    name: "GORK",
                    symbol: "GORK",
                    uri: ipfsData.metadataUri
                },
                "mint": mintKeypair.publicKey.toBase58(),
                "amount": 0,
                "denominatedInSol": "true",
                "slippage": 15,
                "priorityFee": 0.005,
                "pool": "pump"
            })
        });

        if (response.status === 200) {
            const data = await response.arrayBuffer();
            const tx = VersionedTransaction.deserialize(new Uint8Array(data));
            tx.sign([signerKeyPair, mintKeypair]);
            
            const connection = new Connection(RPC_URL);
            const signature = await connection.sendRawTransaction(tx.serialize(), {
                skipPreflight: false,
                preflightCommitment: 'confirmed'
            });
            console.log(`✅ Launch Success! Tx: https://solscan.io/tx/${signature}`);
            console.log(`🚀 Token: https://pump.fun/${mintKeypair.publicKey.toBase58()}`);
            return signature;
        } else {
            console.log(`❌ Create Failed: ${await response.text()}`);
        }
    } catch (e) {
        console.log(`❌ Error: ${e.message}`);
    }
}

launchGork();
