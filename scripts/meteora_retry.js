
const { Connection, Keypair, PublicKey } = require('@solana/web3.js');
const DLMM = require('@meteora-ag/dlmm');
const bs58 = require('bs58');
const BN = require('bn.js');

const PRIVATE_KEY = "4nF4refjPJqzfvRcCSRgTt3BjpStDvabPFtohpfxurghhnBySNZtTnV3nNostDYTApGiFD3cs6J4JjSKTGrYWt61";
const RPC_URL = "https://api.mainnet-beta.solana.com";

async function run() {
    console.log("🌊 RETRYING METEORA DLMM POOL ($GSI - TOKEN-2022)...");
    
    const keypair = Keypair.fromSecretKey(bs58.decode(PRIVATE_KEY));
    const connection = new Connection(RPC_URL, 'confirmed');
    
    const tokenX = new PublicKey("3G9sDbh2jtewCDTCi3zQCY2GjkG5U8ssoZGj3tVW2uoD"); // $GSI (Token-2022)
    const tokenY = new PublicKey("So11111111111111111111111111111111111111112"); // SOL
    
    try {
        const binStep = 100;
        const feeBps = 200; // 2%
        const initialPrice = 0.00000001;
        
        const initPrice = DLMM.getPricePerLamport(
            6, // $GSI decimals
            9, // SOL decimals
            initialPrice
        );
        
        const activateBinId = DLMM.getBinIdFromPrice(
            initPrice,
            binStep,
            false
        );

        console.log(`📦 Creating Pool at Bin ID: ${activateBinId}`);
        
        // Note: Meteora DLMM createCustomizablePermissionlessLbPair 
        // should handle the program id internally if provided or detected.
        // The error was "IncorrectProgramId" on Tokenkeg, meaning it defaulted.
        
        const initPoolTx = await DLMM.createCustomizablePermissionlessLbPair(
            connection,
            new BN(binStep),
            tokenX,
            tokenY,
            new BN(activateBinId.toString()),
            new BN(feeBps),
            0,
            false,
            keypair.publicKey,
            null,
            { cluster: "mainnet-beta" }
        );

        console.log("📡 Sending transaction to the grid...");
        const signature = await connection.sendTransaction(initPoolTx, [keypair], { skipPreflight: true });
        console.log(`✅ SUCCESS: ${signature}`);
        
        return signature;

    } catch (e) {
        console.log(`❌ FAILED: ${e.message}`);
    }
}

run();
