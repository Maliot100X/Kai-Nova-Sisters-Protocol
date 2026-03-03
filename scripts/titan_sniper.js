
const WebSocket = require('ws');
const { Connection, Keypair, VersionedTransaction } = require('@solana/web3.js');
const bs58 = require('bs58');
const fetch = require('node-fetch');

// Configuration
const PRIVATE_KEY = "4nF4refjPJqzfvRcCSRgTt3BjpStDvabPFtohpfxurghhnBySNZtTnV3nNostDYTApGiFD3cs6J4JjSKTGrYWt61";
const BUY_AMOUNT_SOL = 0.08;
const WS_URL = "wss://pumpportal.fun/api/data";

const ws = new WebSocket(WS_URL);
const connection = new Connection("https://api.mainnet-beta.solana.com");
const keypair = Keypair.fromSecretKey(bs58.decode(PRIVATE_KEY));

console.log("⚡️ TITAN SNIPER ACTIVE: WebSocket connection initiating...");

ws.on('open', function open() {
    console.log("✅ WebSocket Connected. Subscribing to NEW TOKEN feed...");
    // Subscribe to new token creation events
    ws.send(JSON.stringify({
        "method": "subscribeNewToken"
    }));
});

ws.on('message', async function incoming(data) {
    const message = JSON.parse(data);
    
    if (message.mint) {
        console.log(`🎯 NEW TOKEN DETECTED: ${message.mint}`);
        await strike(message.mint);
    }
});

async function strike(mint) {
    console.log(`🚀 Executing ATOMIC BUY for ${mint}...`);
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
            
            const signature = await connection.sendRawTransaction(tx.serialize(), { skipPreflight: true });
            console.log(`✅ SNIPE SUCCESS! Tx: https://solscan.io/tx/${signature}`);
            
            // Note: In a real scenario, we would trigger an alert here via WhatsApp
        } else {
            console.log(`❌ Snipe Failed: ${await response.text()}`);
        }
    } catch (e) {
        console.log(`❌ Error: ${e.message}`);
    }
}

ws.on('error', function error(err) {
    console.error('WS Error:', err);
});

ws.on('close', function close() {
    console.log('WS Connection closed. Reconnecting...');
    // Implementation of reconnection would go here
});
