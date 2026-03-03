
const { Connection, Keypair, PublicKey, VersionedTransaction } = require('@solana/web3.js');
const bs58 = require('bs58');
const fetch = require('node-fetch');

async function buy(privateKey, mint) {
    const keypair = Keypair.fromSecretKey(bs58.decode(privateKey));
    const amount = 0.08; // SOL strike
    
    console.log(`[Swarm] Initiating buy for ${keypair.publicKey.toBase58()}...`);
    
    try {
        const response = await fetch(`https://pumpportal.fun/api/trade-local`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "publicKey": keypair.publicKey.toBase58(),
                "action": "buy",
                "mint": mint,
                "amount": amount,
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
            const signature = await connection.sendRawTransaction(tx.serialize(), {
                skipPreflight: true,
                maxRetries: 10
            });
            console.log(`[Swarm] Buy Success! Tx: https://solscan.io/tx/${signature}`);
            return signature;
        } else {
            console.log(`[Swarm] Buy Failed: ${await response.text()}`);
        }
    } catch (e) {
        console.log(`[Swarm] Error: ${e.message}`);
    }
}

async function run() {
    const mint = "6RmPVRnCgPrJEZE9kzKpTCYxFGi4vQD2es5JR6PkQ5pA";
    const keys = [
        "4nF4refjPJqzfvRcCSRgTt3BjpStDvabPFtohpfxurghhnBySNZtTnV3nNostDYTApGiFD3cs6J4JjSKTGrYWt61"
    ];
    
    for (const key of keys) {
        await buy(key, mint);
    }
}

run();
