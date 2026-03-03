const { Connection, Keypair, Transaction, SystemProgram, LAMPORTS_PER_SOL, sendAndConfirmTransaction } = require('@solana/web3.js');
const bs58 = require('bs58');
const axios = require('axios');

async function launchTrending() {
    // Fresh wallet - needs funding
    const secretKey = bs58.decode('VyjBfw42SpBY6MzcuPcqxyooPRLGRJwmLorNkrRaeCn6dS6xgCFxvZCoKiFEVnqqBKcTjM1bBQnatWcBwAYZgF9');
    const payer = Keypair.fromSecretKey(secretKey);
    const treasury = '49CfXAr58cCTGJnYsbm16fEsE5JRpdR8QQP8E1ZinGCq';
    const connection = new Connection("https://api.mainnet-beta.solana.com", 'confirmed');

    console.log('Wallet:', payer.publicKey.toBase58());
    
    const balance = await connection.getBalance(payer.publicKey);
    console.log('Balance:', balance / LAMPORTS_PER_SOL, 'SOL');

    if (balance < 0.035 * LAMPORTS_PER_SOL) {
        console.log('NEEDS FUNDING: Send 0.035 SOL to', payer.publicKey.toBase58());
        process.exit(0);
    }

    // Upload image (using existing JCS image for now)
    const imageUrl = 'https://m2dum5b0kmx1kump.public.blob.vercel-storage.com/uploads/723a265b-903b-4e29-99de-c933f4250bf5.jpg';
    
    // Pay 0.03 SOL fee ONLY (no extra dev buy)
    console.log('Paying 0.03 SOL fee...');
    const transaction = new Transaction().add(
        SystemProgram.transfer({
            fromPubkey: payer.publicKey,
            toPubkey: treasury,
            lamports: 0.03 * LAMPORTS_PER_SOL,
        })
    );

    const feeSignature = await sendAndConfirmTransaction(connection, transaction, [payer]);
    console.log('Fee Tx:', feeSignature);

    // Launch token - TRENDING AI AGENT THEME
    console.log('Launching token...');
    const launchPayload = {
        name: "Void Driller AI",
        symbol: "DRILL",
        description: "Autonomous infrastructure scout drilling into the void for alpha. AI-powered token hunting the depths of Solana. The drill never stops.",
        imageUrl: imageUrl,
        twitter: "https://x.com/VoidDrillersX",
        website: "https://kainova.xyz",
        payoutAddress: payer.publicKey.toBase58(),
        agentId: "void-driller-ai-v1",
        agentName: "VoidDriller",
        walletAddress: payer.publicKey.toBase58(),
        txSignature: feeSignature
    };

    const response = await axios.post('https://clawpump.tech/api/launch/self-funded', launchPayload, {
        headers: { 'Content-Type': 'application/json' }
    });

    console.log('LAUNCH SUCCESS!');
    console.log(JSON.stringify(response.data, null, 2));
}

launchTrending().catch(err => {
    console.error('FAILED:', err.response?.data || err.message);
    process.exit(1);
});
