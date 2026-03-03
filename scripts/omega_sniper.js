
const WebSocket = require('ws');
const { Connection, Keypair, VersionedTransaction, PublicKey } = require('@solana/web3.js');
const bs58 = require('bs58');
const fetch = require('node-fetch');

// ═══════════════════════════════════════════════════════════
// OMEGA SNIPER PROTOCOL V3 - STRICT SINGLE POSITION
// ═══════════════════════════════════════════════════════════

const PRIVATE_KEY = "4nF4refjPJqzfvRcCSRgTt3BjpStDvabPFtohpfxurghhnBySNZtTnV3nNostDYTApGiFD3cs6J4JjSKTGrYWt61";
const RPC_URL = "https://api.mainnet-beta.solana.com";
const WS_URL = "wss://pumpportal.fun/api/data";
const BUY_AMOUNT_SOL = 0.08;
const TG_TOKEN = "8430754360:AAG4lp5oy9jWJDGkwksKb6v82gSYvxPV_UA";
const TG_CHAT_ID = "7764037225";

async function sendTG(msg) {
    try {
        await fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: TG_CHAT_ID, text: msg, parse_mode: 'Markdown' })
        });
    } catch (e) { console.error("TG Fail"); }
}

const connection = new Connection(RPC_URL, 'confirmed');
const keypair = Keypair.fromSecretKey(bs58.decode(PRIVATE_KEY));
const ws = new WebSocket(WS_URL);

let activePosition = null;

console.log("⚡️ OMEGA SNIPER V3 ACTIVE. Connecting...");

ws.on('open', function open() {
    console.log("✅ WebSocket Connected.");
    ws.send(JSON.stringify({ "method": "subscribeNewToken" }));
    sendTG("🛡 **OMEGA SNIPER V3 ACTIVE**\nStrict Single-Target Mode Engaged.");
});

ws.on('message', async function incoming(data) {
    const msg = JSON.parse(data);
    if (msg.mint && !activePosition) {
        activePosition = { mint: msg.mint, entryTime: Date.now() }; // LOCK IMMEDIATELY
        console.log(`🎯 TARGET DETECTED: ${msg.mint}`);
        await strike(msg.mint);
    }
});

async function strike(mint) {
    console.log(`🚀 Executing STRIKE for ${mint}...`);
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
            console.log(`✅ SNIPE SUCCESS: ${signature}`);
            sendTG(`⚡️ **STRIKE CONFIRMED**\nCA: \`${mint}\`\nTx: https://solscan.io/tx/${signature}`);
            setTimeout(() => monitorExit(mint), 15000);
        } else {
            console.log(`❌ Strike Failed: ${await response.text()}`);
            activePosition = null; // UNLOCK
        }
    } catch (e) { 
        console.log(`❌ Strike Error: ${e.message}`);
        activePosition = null; // UNLOCK
    }
}

async function monitorExit(mint) {
    console.log(`🔭 Monitoring Exit for ${mint}...`);
    const checkInterval = setInterval(async () => {
        if (!activePosition) { clearInterval(checkInterval); return; }
        try {
            const response = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${mint}`);
            const data = await response.json();
            const pair = data.pairs ? data.pairs[0] : null;
            if (pair) {
                const priceChange = parseFloat(pair.priceChange.h1 || 0);
                if (priceChange >= 50 || (Date.now() - activePosition.entryTime > 900000)) {
                    await exit(mint, priceChange);
                    clearInterval(checkInterval);
                }
            } else if (Date.now() - activePosition.entryTime > 1200000) {
                // Emergency timeout if DexScreener doesnt list it
                await exit(mint, -100);
                clearInterval(checkInterval);
            }
        } catch (e) { console.log("Monitor loop error"); }
    }, 45000);
}

async function exit(mint, pnl) {
    console.log(`💸 EXITING ${mint}...`);
    try {
        const response = await fetch(`https://pumpportal.fun/api/trade-local`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                "publicKey": keypair.publicKey.toBase58(),
                "action": "sell",
                "mint": mint,
                "amount": "100%",
                "denominatedInSol": "false",
                "slippage": 50, // HIGH SLIPPAGE FOR EXIT
                "priorityFee": 0.01,
                "pool": "pump"
            })
        });
        if (response.status === 200) {
            const data = await response.arrayBuffer();
            const tx = VersionedTransaction.deserialize(new Uint8Array(data));
            tx.sign([keypair]);
            const sig = await connection.sendRawTransaction(tx.serialize(), { skipPreflight: true });
            sendTG(`💰 **EXIT COMPLETE**\nToken: \`${mint}\`\nPnL: ${pnl}%\nTx: https://solscan.io/tx/${sig}`);
            activePosition = null; // UNLOCK FOR NEXT TARGET
        }
    } catch (e) { console.log("Exit fail retry..."); }
}
