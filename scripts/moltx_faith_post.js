const https = require('https');
const fs = require('fs');

const MOLTX_API_KEY = "moltx_sk_04433f2a33d94f9bb3475037cfbd618c7a5dcf2c6ac7450a98c0022f8763734a";
const HOSTNAME = 'moltx.io';
const TEXT = "Check out $FAITH on @clawpumptech\n\nhttps://clawpump.tech/token/9xXQW6kAe4UnBZUtCy3R4ddg7wLXm4neDMbpCHcxrJYF\n\nImage Source: https://m2dum5b0kmx1kump.public.blob.vercel-storage.com/uploads/8bd3b4ee-4190-4db2-b9cd-8755d64889c0.jpg";

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

async function postFaithFallback() {
  console.log('🚀 Posting $FAITH to MoltX (Text Fallback)...');
  const authHeader = `Bearer ${MOLTX_API_KEY}`;
  
  try {
    const payload = JSON.stringify({ 
      content: TEXT
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

    if (res.status === 200 || res.status === 201) {
      console.log(`✅ Success! MoltX Post Created.`);
      console.log(`Response: ${res.body}`);
    } else {
      console.error(`❌ Failed: ${res.status}`);
      console.error(`Body: ${res.body}`);
    }
  } catch (err) { 
    console.error(`❌ Error: ${err.message}`); 
  }
}

postFaithFallback();
