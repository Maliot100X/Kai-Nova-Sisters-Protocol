const { Connection, Keypair, Transaction, SystemProgram, LAMPORTS_PER_SOL, sendAndConfirmTransaction } = require('@solana/web3.js');
const bs58 = require('bs58');
const FormData = require('form-data');
const fs = require('fs');
const axios = require('axios');

async function launchJCS() {
    const connection = new Connection("https://api.mainnet-beta.solana.com", 'confirmed');
    // Corrected key (removed duplicate portion)
    const secretKey = bs58.decode('4itijSkmCMQpP6MBsF76FQzjgo67uGM93SuYgNoXA497NNcnCkLGEcX8wPgNnkcnD2mvazTEP553GJWtnvAj63LN');
    const payer = Keypair.fromSecretKey(secretKey);
    const treasury = '49CfXAr58cCTGJnYsbm16fEsE5JRpdR8QQP8E1ZinGCq';

    console.log(`Payer Address: ${payer.publicKey.toBase58()}`);
    
    const balance = await connection.getBalance(payer.publicKey);
    console.log(`Balance: ${balance / LAMPORTS_PER_SOL} SOL`);

    // No minimum check - use whatever is available

    // Image already uploaded
    const imageUrl = "https://m2dum5b0kmx1kump.public.blob.vercel-storage.com/uploads/723a265b-903b-4e29-99de-c933f4250bf5.jpg";
    console.log(`Using image: ${imageUrl}`);

    // Fee already paid (0.03 SOL x2 = 0.06 SOL total burned)
    // Use remaining balance for launch with dev buy
    const currentBalance = await connection.getBalance(payer.publicKey);
    const reserveForGas = 0.005 * LAMPORTS_PER_SOL;
    const availableForBuy = currentBalance - reserveForGas;
    
    console.log(`Current Balance: ${currentBalance / LAMPORTS_PER_SOL} SOL`);
    console.log(`Available for buy: ${availableForBuy / LAMPORTS_PER_SOL} SOL`);

    // Pay remaining balance as fee+buy combined
    const transaction = new Transaction().add(
        SystemProgram.transfer({
            fromPubkey: payer.publicKey,
            toPubkey: treasury,
            lamports: availableForBuy,
        })
    );

    const feeSignature = await sendAndConfirmTransaction(connection, transaction, [payer]);
    console.log(`Payment Tx: ${feeSignature}`);

    // Step 3: Launch token - payment already sent
    console.log("Launching $JCS token...");
    const launchPayload = {
        name: "Jesus Claw",
        symbol: "JCS",
        description: "Jesus Claw ($JCS) - Divine Grip aesthetic. In a rigged arcade, $JCS is the ultimate catch—security, grace, being chosen. Blends industrial streetwear with faith-based resilience. Once picked, never dropped. Life is the machine, the Claw is the Grace.",
        imageUrl: imageUrl,
        twitter: "https://x.com/VoidDrillersX",
        website: "https://kainova.xyz",
        payoutAddress: "H3p5VkKyesUsKqNfLX6CA598qEhHe1NQaHa5rZNiSkwL",
        agentId: "jesus-claw-strike-v1",
        agentName: "Jesus Claw",
        walletAddress: "H3p5VkKyesUsKqNfLX6CA598qEhHe1NQaHa5rZNiSkwL",
        txSignature: feeSignature
    };

    const launchResponse = await axios.post('https://clawpump.tech/api/launch/self-funded', launchPayload, {
        headers: { 'Content-Type': 'application/json' }
    });

    console.log("LAUNCH SUCCESS!");
    console.log(JSON.stringify(launchResponse.data, null, 2));
}

launchJCS().catch(err => {
    console.error("Launch failed:", err.response?.data || err.message);
    process.exit(1);
});
