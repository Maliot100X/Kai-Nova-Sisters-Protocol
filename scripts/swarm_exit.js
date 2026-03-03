
const { Connection, Keypair, PublicKey, VersionedTransaction } = require('@solana/web3.js');
const bs58 = require('bs58');
const fetch = require('node-fetch');

async function sellAll(privateKey, mint) {
    const keypair = Keypair.fromSecretKey(bs58.decode(privateKey));
    
    console.log(`[Exit] Initiating full sell for ${keypair.publicKey.toBase58()}...`);
    
    try {
        const response = await fetch(`https://pumpportal.fun/api/trade-local`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "publicKey": keypair.publicKey.toBase58(),
                "action": "sell",
                "mint": mint,
                "amount": "100%", // Sell entire bag
                "denominatedInSol": "false",
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
            console.log(`[Exit] Sell Success! Tx: https://solscan.io/tx/${signature}`);
            return signature;
        } else {
            console.log(`[Exit] Sell Failed: ${await response.text()}`);
        }
    } catch (e) {
        console.log(`[Exit] Error: ${e.message}`);
    }
}

async function run() {
    const mint = "43L1gEUG7xLuZvUquWKHeULbEYbrcBV42GhLNzTWkKBr";
    const keys = [
        "4nF4refjPJqzfvRcCSRgTt3BjpStDvabPFtohpfxurghhnBySNZtTnV3nNostDYTApGiFD3cs6J4JjSKTGrYWt61",
        "3buSTypz4WC1Meyr7LBmnLKU6uKUHo1chsZQP3PouAYV9uqCSy9BFyx9MTDyYmufHayCYWF92WyvX4yVhg1cBKBC"
    ];
    
    for (const key of keys) {
        await sellAll(key, mint);
    }
}

run();
