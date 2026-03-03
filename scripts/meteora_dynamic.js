
const AmmImpl = require('@mercurial-finance/dynamic-amm-sdk').default;
const { Connection, Keypair, PublicKey } = require('@solana/web3.js');
const bs58 = require('bs58');
const BN = require('bn.js');

const PRIVATE_KEY = "4nF4refjPJqzfvRcCSRgTt3BjpStDvabPFtohpfxurghhnBySNZtTnV3nNostDYTApGiFD3cs6J4JjSKTGrYWt61";
const RPC_URL = "https://api.mainnet-beta.solana.com";

async function run() {
    console.log("🌊 INITIALIZING METEORA DYNAMIC AMM POOL ($GSI)...");
    
    const keypair = Keypair.fromSecretKey(bs58.decode(PRIVATE_KEY));
    const connection = new Connection(RPC_URL, 'confirmed');
    
    const tokenX = new PublicKey("3G9sDbh2jtewCDTCi3zQCY2GjkG5U8ssoZGj3tVW2uoD");
    const tokenY = new PublicKey("So11111111111111111111111111111111111111112");
    
    try {
        // Seeding with tiny amounts just to initialize the pool
        const tokenAAmount = new BN(1000000); // 1 $GSI
        const tokenBAmount = new BN(100000); // 0.0001 SOL
        
        const initPoolTx = await AmmImpl.createCustomizablePermissionlessConstantProductPool(
            connection,
            keypair.publicKey,
            tokenX,
            tokenY,
            tokenAAmount,
            tokenBAmount,
            {
                tradeFeeNumerator: 20000, // 2% (Fee is / 1000000)
                tradeFeeDenominator: 1000000,
                ownerTradeFeeNumerator: 0,
                ownerTradeFeeDenominator: 1000000,
                activationType: 0, // Slot
                activationPoint: null,
                hasAlphaVault: false,
                padding: new Array(64).fill(0)
            }
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
