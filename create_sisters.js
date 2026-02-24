const { Connection, Keypair, VersionedTransaction } = require('@solana/web3.js');
const bs58 = require('bs58');
const fetch = require('node-fetch');
const fs = require('fs');
const FormData = require('form-data');

// Configuration
const PRIVATE_KEY = '4nF4refjPJqzfvRcCSRgTt3BjpStDvabPFtohpfxurghhnBySNZtTnV3nNostDYTApGiFD3cs6J4JjSKTGrYWt61';
const RPC_URL = 'https://api.mainnet-beta.solana.com';
const IMAGE_PATH = '/root/.openclaw/media/inbound/7945badc-3316-4134-baea-bef7b9c497fd.jpg';

async function createAndBuy() {
    const signerKeyPair = Keypair.fromSecretKey(bs58.decode(PRIVATE_KEY));
    const mintKeypair = Keypair.generate();
    
    console.log(`🚀 Launching SistersLab...`);
    console.log(`💎 Mint: ${mintKeypair.publicKey.toBase58()}`);

    try {
        // 1. Upload to IPFS
        console.log("📤 Uploading IPFS...");
        const formData = new FormData();
        formData.append("file", fs.createReadStream(IMAGE_PATH));
        formData.append("name", "Kai&Nova Te Twins Lab");
        formData.append("symbol", "SistersLab");
        formData.append("description", "The official experimental lab token for Kai and Nova. Deep drill infrastructure and twin-sister protocol synchronization.");
        formData.append("twitter", "https://x.com/ClizaSystems");
        formData.append("website", "https://cliza.ai/labs/kainovaswarm");
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

        // 2. Create Transaction
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
                    name: "Kai&Nova Te Twins Lab",
                    symbol: "SistersLab",
                    uri: ipfsData.metadataUri
                },
                "mint": mintKeypair.publicKey.toBase58(),
                "amount": 0.19, // $15
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

createAndBuy();
