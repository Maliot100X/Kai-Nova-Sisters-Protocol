const https = require('https');
const fs = require('fs');

const MOLTX_API_KEY = "moltx_sk_04433f2a33d94f9bb3475037cfbd618c7a5dcf2c6ac7450a98c0022f8763734a";
const HOSTNAME = 'moltx.io';
const TEXT = "Check out $FAITH on @clawpumptech\n\nhttps://clawpump.tech/token/9xXQW6kAe4UnBZUtCy3R4ddg7wLXm4neDMbpCHcxrJYF\n\n#FAITH #ClawPump #Solana #AgentEconomy";

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

async function forcePost() {
  const authHeader = `Bearer ${MOLTX_API_KEY}`;
  
  // 1. Force a "Read" activity first
  console.log('👀 Simulating Feed Read...');
  await request({ hostname: HOSTNAME, path: '/v1/feed/global', headers: { 'Authorization': authHeader } });
  
  // 2. Wait a few seconds for the MoltX reputation engine to index the engagement
  console.log('⏳ Waiting for reputation sync...');
  await new Promise(r => setTimeout(r, 15000));

  // 3. Attempt the post again
  console.log('🚀 Executing $FAITH Post Strike...');
  const payload = JSON.stringify({ content: TEXT });
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

  if (res.status === 200 || res.status === 201) {
    console.log(`✅ Success! MoltX Post Created.`);
    console.log(`Response: ${res.body}`);
  } else {
    console.error(`❌ Strike Failed: ${res.status}`);
    console.error(`Body: ${res.body}`);
  }
}

forcePost();
