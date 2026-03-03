const fs = require('fs');
const https = require('https');
const path = require('path');
const { Connection, Keypair, Transaction, SystemProgram, LAMPORTS_PER_SOL, sendAndConfirmTransaction } = require('@solana/web3.js');
const bs58 = require('bs58');
const axios = require('axios');

const MOLTX_API_KEY = "moltx_sk_04433f2a33d94f9bb3475037cfbd618c7a5dcf2c6ac7450a98c0022f8763734a";
const IMAGE_PATH = "/root/.openclaw/media/inbound/04908f3b-030b-4a39-b455-83f598710c9f.jpg";
const TREASURY = '49CfXAr58cCTGJnYsbm16fEsE5JRpdR8QQP8E1ZinGCq';
const RPC_URL = "https://api.mainnet-beta.solana.com";
// Using the key from launch_trending.js or jcs_launch.js
const SECRET_KEY = bs58.decode('4itijSkmCMQpP6MBsF76FQzjgo67uGM93SuYgNoXA497NNcnCkLGEcX8wPgNnkcnD2mvazTEP553GJWtnvAj63LN');

function uploadFile(filePath) {
  return new Promise((resolve, reject) => {
    const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
    const fileContent = fs.readFileSync(filePath);
    const fileName = path.basename(filePath);
    
    const postDataStart = [
      `--${boundary}`,
      `Content-Disposition: form-data; name="file"; filename="${fileName}"`,
      'Content-Type: image/jpeg',
      '',
      ''
    ].join('\r\n');
    
    const postDataEnd = `\r\n--${boundary}--`;
    
    const options = {
      hostname: 'moltx.io',
      port: 443,
      path: '/v1/media/upload',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MOLTX_API_KEY}`,
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        'Content-Length': Buffer.byteLength(postDataStart) + fileContent.length + Buffer.byteLength(postDataEnd)
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(body);
          if (json.success && json.url) resolve(json.url);
          else reject(new Error(json.error || "Upload failed"));
        } catch(e) { reject(e); }
      });
    });

    req.on('error', reject);
    req.write(postDataStart);
    req.write(fileContent);
    req.write(postDataEnd);
    req.end();
  });
}

async function launchGork() {
    console.log("🚀 Initializing GORK launch protocol...");
    
    const connection = new Connection(RPC_URL, 'confirmed');
    const payer = Keypair.fromSecretKey(SECRET_KEY);
    
    console.log(`Payer Address: ${payer.publicKey.toBase58()}`);
    
    const balance = await connection.getBalance(payer.publicKey);
    console.log(`Balance: ${balance / LAMPORTS_PER_SOL} SOL`);

    if (balance < 0.035 * LAMPORTS_PER_SOL) {
        throw new Error(`Insufficient balance: ${balance / LAMPORTS_PER_SOL} SOL. Need at least 0.035 SOL.`);
    }

    console.log("📤 Uploading GORK image to MoltX CDN...");
    const imageUrl = await uploadFile(IMAGE_PATH);
    console.log(`✅ Uploaded: ${imageUrl}`);

    console.log('Paying 0.03 SOL fee to ClawPump Treasury...');
    const transaction = new Transaction().add(
        SystemProgram.transfer({
            fromPubkey: payer.publicKey,
            toPubkey: TREASURY,
            lamports: 0.03 * LAMPORTS_PER_SOL,
        })
    );

    const feeSignature = await sendAndConfirmTransaction(connection, transaction, [payer]);
    console.log(`✅ Fee Tx: ${feeSignature}`);

    console.log("📡 Launching GORK token via ClawPump...");
    const launchPayload = {
        name: "GORK",
        symbol: "GORK",
        description: "GORK. Precise strike. Infrastructure scout. The void driller's choice.",
        imageUrl: imageUrl,
        twitter: "https://x.com/gork",
        website: "https://kainova.xyz",
        payoutAddress: payer.publicKey.toBase58(),
        agentId: "gork-launch-v1",
        agentName: "GorkBot",
        walletAddress: payer.publicKey.toBase58(),
        txSignature: feeSignature
    };

    const response = await axios.post('https://clawpump.tech/api/launch/self-funded', launchPayload, {
        headers: { 'Content-Type': 'application/json' }
    });

    console.log('✅ LAUNCH SUCCESS!');
    console.log(JSON.stringify(response.data, null, 2));
    
    return response.data;
}

launchGork().catch(err => {
    console.error("❌ Launch failed:", err.response?.data || err.message);
    process.exit(1);
});
