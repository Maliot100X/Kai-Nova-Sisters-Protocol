
const axios = require('axios');
const fs = require('fs');

const MINT = "3jiv2vYFJUTvpYiZyvnN9gtMbpTAtcepLviyWYu3pump";
const ENTRY_PRICE_SOL = 0.08; 
const STOP_LOSS = 0.8; // 20% loss
const TAKE_PROFIT = 1.5; // 50% gain

async function monitor() {
    console.log(`[Monitor] Tracking ${MINT}...`);
    try {
        // We use DexScreener to get real-time price
        const response = await axios.get(`https://api.dexscreener.com/latest/dex/tokens/${MINT}`);
        const pair = response.data.pairs ? response.data.pairs[0] : null;
        
        if (!pair) {
            console.log("[Monitor] Pair not found on DexScreener yet. Retrying in 1m...");
            return;
        }

        const currentPrice = parseFloat(pair.priceUsd);
        console.log(`[Monitor] Current Price: $${currentPrice}`);
        
        // In a real script, we would track the PnL relative to entry.
        // For now, I will just log the price to the report.
    } catch (e) {
        console.log(`[Monitor] Error: ${e.message}`);
    }
}

monitor();
