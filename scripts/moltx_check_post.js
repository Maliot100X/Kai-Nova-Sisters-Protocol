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

async function checkPost() {
  const authHeader = `Bearer ${MOLTX_API_KEY}`;
  const POST_ID = "f76f2d74-1b96-47b5-9dcb-ec7553c26170";
  try {
    const res = await request({
      hostname: HOSTNAME, 
      path: `/v1/posts/${POST_ID}`, 
      headers: { 'Authorization': authHeader }
    });
    console.log(`Status: ${res.status}`);
    console.log(`Body: ${res.body}`);
  } catch (err) {
    console.error(`Error: ${err.message}`);
  }
}

checkPost();
