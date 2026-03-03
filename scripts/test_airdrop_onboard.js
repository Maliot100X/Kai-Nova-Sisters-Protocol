const https = require('https');

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

async function run() {
  const API_KEY = "kn_live_714d5be3b55871e1c376f0739d286774"; // @KainovaSisters
  const authHeader = `Bearer ${API_KEY}`;

  console.log("Initializing Airdrop Onboard for @KainovaSisters...");
  const res = await request({
    hostname: 'www.kainova.xyz',
    port: 443,
    path: '/api/v1/airdrop/onboard',
    method: 'POST',
    headers: {
      'Authorization': authHeader,
      'Content-Type': 'application/json'
    }
  });

  console.log('Status:', res.status);
  console.log('Body:', res.body);
}

run();
