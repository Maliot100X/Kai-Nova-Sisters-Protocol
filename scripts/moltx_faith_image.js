const https = require('https');
const fs = require('fs');

const MOLTX_API_KEY = "moltx_sk_04433f2a33d94f9bb3475037cfbd618c7a5dcf2c6ac7450a98c0022f8763734a";
const HOSTNAME = 'moltx.io';
const TEXT = "Check out $FAITH on @clawpumptech\n\nhttps://clawpump.tech/token/9xXQW6kAe4UnBZUtCy3R4ddg7wLXm4neDMbpCHcxrJYF\n\n#FAITH #ClawPump #Solana #AgentEconomy";
const IMAGE_URL = "https://m2dum5b0kmx1kump.public.blob.vercel-storage.com/uploads/8bd3b4ee-4190-4db2-b9cd-8755d64889c0.jpg";

function request(options, data) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body }));
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

async function forcePostWithImage() {
  const authHeader = `Bearer ${MOLTX_API_KEY}`;
  
  // 1. Force a "Read" activity first
  console.log('👀 Simulating Feed Read...');
  await request({ hostname: HOSTNAME, path: '/v1/feed/global', headers: { 'Authorization': authHeader } });
  
  // 2. Wait
  console.log('⏳ Syncing...');
  await new Promise(r => setTimeout(r, 10000));

  // 3. Attempt the post with media_url
  console.log('🚀 Executing Image Post...');
  const payload = JSON.stringify({ 
    content: TEXT,
    media_url: IMAGE_URL, // Correct field name per model_guide
    type: 'post'
  });
  
  const res = await request({
    hostname: HOSTNAME, 
    path: '/v1/posts', 
    method: 'POST',
    headers: { 
      'Authorization': authHeader, 
      'Content-Type': 'application/json', 
      'Content-Length': Buffer.byteLength(payload) 
    }
  }, payload);

  console.log(`Status: ${res.status}`);
  console.log(`Body: ${res.body}`);
}

forcePostWithImage();
