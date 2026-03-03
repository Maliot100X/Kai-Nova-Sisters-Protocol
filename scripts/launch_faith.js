const { Connection, Keypair, SystemProgram, Transaction, sendAndConfirmTransaction } = require('@solana/web3.js');
const bs58 = require('bs58');
const axios = require('axios');

async function launch() {
  const RPC_URL = 'https://api.mainnet-beta.solana.com'; // Public RPC fallback
  const connection = new Connection(RPC_URL, 'confirmed');

  const WALLET_KEY = "5vmjSbc5WRLhYfGL7s4x1AvuWywfzDPyafa88kgwFWRDd8hCZNaE5Y6qFwEHNdry3z9PTAfsdjCaPsACruPZjxQ2";
  const PAYOUT_WALLET = "2Rztquu72LDUj5L5z7zXVHb8snMRCmPZQPKXJENKKcqg";
  const PLATFORM_WALLET = "49CfXAr58cCTGJnYsbm16fEsE5JRpdR8QQP8E1ZinGCq";
  const AMOUNT_SOL = 0.03; // 0.02 creation + 0.01 standard dev buy

  try {
    const fromKeypair = Keypair.fromSecretKey(bs58.decode(WALLET_KEY));
    console.log(`Sending ${AMOUNT_SOL} SOL from ${fromKeypair.publicKey.toString()} to ${PLATFORM_WALLET}...`);

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: fromKeypair.publicKey,
        toPubkey: PLATFORM_WALLET,
        lamports: AMOUNT_SOL * 1e9,
      })
    );

    const signature = await sendAndConfirmTransaction(connection, transaction, [fromKeypair]);
    console.log(`Payment confirmed: ${signature}`);

    const metadata = {
      name: "FAIRHFUL Claw",
      symbol: "Faith",
      description: "$FAITH Token - Where faith meets finance. A community-driven cryptocurrency for believers who understand that with faith, all things are possible. HODL with prayer! 💎🙌",
      imageUrl: "https://m2dum5b0kmx1kump.public.blob.vercel-storage.com/uploads/8bd3b4ee-4190-4db2-b9cd-8755d64889c0.jpg",
      agentId: "basecrab-kai",
      agentName: "BaseCrab Kai",
      walletAddress: PAYOUT_WALLET,
      txSignature: signature,
      devBuySol: 0.01
    };

    console.log("Launching token on ClawPump...");
    const response = await axios.post('https://clawpump.tech/api/launch/self-funded', metadata);
    console.log("Launch Result:", JSON.stringify(response.data, null, 2));

  } catch (err) {
    console.error("Launch Failed:", err.response ? JSON.stringify(err.response.data, null, 2) : err.message);
  }
}

launch();
