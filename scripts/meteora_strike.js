
const { Connection, Keypair, PublicKey } = require('@solana/web3.js');
const DLMM = require('@meteora-ag/dlmm').default;
const bs58 = require('bs58');
const BN = require('bn.js');

const PRIVATE_KEY = "4nF4refjPJqzfvRcCSRgTt3BjpStDvabPFtohpfxurghhnBySNZtTnV3nNostDYTApGiFD3cs6J4JjSKTGrYWt61";
const RPC_URL = "https://api.mainnet-beta.solana.com";

async function createPool() {
    console.log("🌊 INITIALIZING METEORA DLMM POOL...");
    
    const keypair = Keypair.fromSecretKey(bs58.decode(PRIVATE_KEY));
    const connection = new Connection(RPC_URL, 'confirmed');
    
    const tokenX = new PublicKey("3G9sDbh2jtewCDTCi3zQCY2GjkG5U8ssoZGj3tVW2uoD"); // $GSI
    const tokenY = new PublicKey("So11111111111111111111111111111111111111112"); // SOL
    
    try {
        // Parameters for permissionless pool
        const binStep = 100;
        const feeBps = new BN(200); // 2%
        
        console.log("📦 Constructing creation transaction...");
        
        // Use the static method to create the pool transaction
        const createTx = await DLMM.createPermissionlessLbPair(
            connection,
            keypair.publicKey,
            tokenX,
            tokenY,
            new BN(binStep),
            feeBps,
            new BN(0), // initial price index (0 = 1:1 roughly)
            keypair.publicKey // creator
        );

        console.log("📡 Sending creation transaction...");
        const signature = await connection.sendTransaction(createTx, [keypair]);
        console.log(`✅ POOL CREATED! Tx: https://solscan.io/tx/${signature}`);
        
        // Wait for confirmation
        await connection.confirmTransaction(signature);
        
        console.log("Seeding liquidity...");
        // After creation, we would typically add liquidity here.
        // For now, getting the CA of the pool is the priority.
    } catch (e) {
        console.log(`❌ METEORA ERROR: ${e.message}`);
        if (e.message.includes("already exists")) {
            console.log("⚠️ Pool already exists. Transitioning to seeding phase.");
        }
    }
}

createPool();
