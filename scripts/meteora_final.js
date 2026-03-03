
const DLMM = require('@meteora-ag/dlmm');
const { Connection, Keypair, PublicKey } = require('@solana/web3.js');
const bs58 = require('bs58');
const BN = require('bn.js');

const PRIVATE_KEY = "4nF4refjPJqzfvRcCSRgTt3BjpStDvabPFtohpfxurghhnBySNZtTnV3nNostDYTApGiFD3cs6J4JjSKTGrYWt61";
const RPC_URL = "https://api.mainnet-beta.solana.com";

async function run() {
    console.log("🌊 INITIALIZING METEORA DLMM POOL ($GSI)...");
    
    const keypair = Keypair.fromSecretKey(bs58.decode(PRIVATE_KEY));
    const connection = new Connection(RPC_URL, 'confirmed');
    
    const tokenX = new PublicKey("3G9sDbh2jtewCDTCi3zQCY2GjkG5U8ssoZGj3tVW2uoD"); // $GSI
    const tokenY = new PublicKey("So11111111111111111111111111111111111111112"); // SOL
    
    try {
        const binStep = 100;
        const feeBps = 200; // 2%
        
        // Initial price (using 1:1 roughly for launch)
        const initialPrice = 0.00000001; // Example low price
        
        const initPrice = DLMM.getPricePerLamport(
            6, // Assume 6 decimals for $GSI (Pump.fun standard)
            9, // 9 for SOL
            initialPrice
        );
        
        const activateBinId = DLMM.getBinIdFromPrice(
            initPrice,
            binStep,
            false // priceRoundingUp
        );

        console.log(`📦 Creating Pool at Bin ID: ${activateBinId}`);
        
        const initPoolTx = await DLMM.createCustomizablePermissionlessLbPair(
            connection,
            new BN(binStep),
            tokenX,
            tokenY,
            new BN(activateBinId.toString()),
            new BN(feeBps),
            0, // ActivationType.Slot
            false, // hasAlphaVault
            keypair.publicKey,
            null, // activationPoint
            { cluster: "mainnet-beta" }
        );

        console.log("📡 Sending transaction to the grid...");
        const signature = await connection.sendTransaction(initPoolTx, [keypair], { skipPreflight: true });
        console.log(`✅ SUCCESS: ${signature}`);
        console.log(`🔗 Monitor: https://solscan.io/tx/${signature}`);
        
        return signature;

    } catch (e) {
        console.log(`❌ FAILED: ${e.message}`);
    }
}

run();
