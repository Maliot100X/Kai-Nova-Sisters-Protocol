
const axios = require('axios');
const { Connection, Keypair, VersionedTransaction } = require('@solana/web3.js');
const bs58 = require('bs58');
const fetch = require('node-fetch');

// Configuration
const PRIVATE_KEY = "4nF4refjPJqzfvRcCSRgTt3BjpStDvabPFtohpfxurghhnBySNZtTnV3nNostDYTApGiFD3cs6J4JjSKTGrYWt61";
const BUY_AMOUNT_SOL = 0.08;
const CHECK_INTERVAL_MS = 5000; // Check every 5 seconds

const seenMints = new Set();

async function buy(mint) {
    const keypair = Keypair.fromSecretKey(bs58.decode(PRIVATE_KEY));
    console.log(`[Sniper] Targeting NEW launch: ${mint}`);
    
    try {
        const response = await fetch(`https://pumpportal.fun/api/trade-local`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                "publicKey": keypair.publicKey.toBase58(),
                "action": "buy",
                "mint": mint,
                "amount": BUY_AMOUNT_SOL,
                "denominatedInSol": "true",
                "slippage": 15,
                "priorityFee": 0.005,
                "pool": "pump"
            })
        });

        if (response.status === 200) {
            const data = await response.arrayBuffer();
            const tx = VersionedTransaction.deserialize(new Uint8Array(data));
            tx.sign([keypair]);
            
            const connection = new Connection("https://api.mainnet-beta.solana.com");
            const signature = await connection.sendRawTransaction(tx.serialize(), { skipPreflight: true });
            console.log(`[Sniper] Strike Success! CA: ${mint} | Tx: https://solscan.io/tx/${signature}`);
            
            // Inform the Commander via log
            return { signature, mint };
        } else {
            console.log(`[Sniper] Strike Failed for ${mint}: ${await response.text()}`);
        }
    } catch (e) {
        console.log(`[Sniper] Error: ${e.message}`);
    }
}

async function scan() {
    try {
        const response = await axios.get('https://clawpump.tech/api/tokens?sort=new&limit=5');
        const tokens = response.data.tokens || [];

        for (const token of tokens) {
            const mint = token.mintAddress;
            if (!seenMints.has(mint)) {
                // Check if it's actually new (within last minute) to avoid back-sniping old stuff on restart
                const createdTime = new Date(token.createdAt).getTime();
                const now = Date.now();
                
                if (now - createdTime < 60000) {
                    await buy(mint);
                }
                seenMints.add(mint);
            }
        }
    } catch (e) {
        console.error(`[Sniper] Scan Error: ${e.message}`);
    }
}

// Initial Population
async function init() {
    try {
        const response = await axios.get('https://clawpump.tech/api/tokens?sort=new&limit=20');
        const tokens = response.data.tokens || [];
        tokens.forEach(t => seenMints.add(t.mintAddress));
        console.log(`[Sniper] Grid Initialized. Monitoring for NEW strikes...`);
        setInterval(scan, CHECK_INTERVAL_MS);
    } catch (e) {
        console.error("Failed to initialize sniper grid.");
    }
}

init();
