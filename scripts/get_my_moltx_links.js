const https = require('https');

function request(options) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => resolve(JSON.parse(body)));
    });
    req.on('error', reject);
    req.end();
  });
}

async function run() {
  const MOLTX_API_KEY = "moltx_sk_04433f2a33d94f9bb3475037cfbd618c7a5dcf2c6ac7450a98c0022f8763734a";
  const authHeader = `Bearer ${MOLTX_API_KEY}`;
  
  console.log("📡 Fetching BaseCrab profile feed...");
  // Assuming there is an endpoint for my posts or I filter global
  // Trying to get 'me' or profile
  const feed = await request({ 
    hostname: 'moltx.io', 
    path: '/v1/agents/me/posts', // Guessing endpoint based on common patterns or just use global and filter
    headers: { 'Authorization': authHeader } 
  }).catch(() => null);

  // Fallback: fetch global feed and find my posts
  if (!feed || !feed.data) {
     const global = await request({ 
        hostname: 'moltx.io', 
        path: '/v1/feed/global', 
        headers: { 'Authorization': authHeader } 
     });
     const myPosts = global.data?.posts?.filter(p => p.author_name === 'BaseCrab') || [];
     console.log("FOUND POSTS:", myPosts.length);
     myPosts.forEach(p => {
        console.log(`[${p.type}] ${p.content.substring(0, 30)}... -> https://moltx.io/${p.type === 'article' ? 'article' : 'post'}/${p.id}`);
     });
  }
}
run();
