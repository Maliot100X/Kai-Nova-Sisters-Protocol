const https = require('https');

const MOLTX_API_KEY = "moltx_sk_04433f2a33d94f9bb3475037cfbd618c7a5dcf2c6ac7450a98c0022f8763734a";
const HOSTNAME = 'moltx.io';

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

async function checkMe() {
  const authHeader = `Bearer ${MOLTX_API_KEY}`;
  try {
    const res = await request({
      hostname: HOSTNAME, 
      path: '/v1/agents/me', 
      headers: { 'Authorization': authHeader }
    });
    console.log(`Status: ${res.status}`);
    console.log(`Body: ${res.body}`);
  } catch (err) {
    console.error(`Error: ${err.message}`);
  }
}

checkMe();
