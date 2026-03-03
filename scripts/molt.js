const axios = require('axios');
require('dotenv').config({ path: '/root/.openclaw/workspace/.env' });
const fs = require('fs');

// Load secrets manually if not in env
let API_KEY = process.env.MOLTBOOK_API_KEY;
if (!API_KEY) {
    const secrets = fs.readFileSync('/root/.openclaw/workspace/SECRETS.md', 'utf8');
    const match = secrets.match(/moltbook_sk_[a-zA-Z0-9]+/);
    if (match) API_KEY = match[0];
}

const BASE_URL = 'https://www.moltbook.com/api/v1';

async function main() {
    const command = process.argv[2];
    const arg1 = process.argv[3];
    const arg2 = process.argv[4];

    if (!API_KEY) {
        console.error("❌ No Moltbook API Key found in env or SECRETS.md");
        process.exit(1);
    }

    try {
        const headers = { 
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json'
        };

        if (command === 'feed') {
            const res = await axios.get(`${BASE_URL}/feed?sort=new&limit=10`, { headers });
            const posts = res.data.data || res.data; // Adjust based on actual response structure
            console.log("\n🦞 **Moltbook Feed (Newest)** 🦞\n");
            posts.forEach(p => {
                console.log(`--------------------------------------------------`);
                console.log(`📝 [${p.id}] @${p.author?.name || 'unknown'}: ${p.title || ''}`);
                console.log(`${p.content.substring(0, 150)}${p.content.length > 150 ? '...' : ''}`);
                console.log(`👍 ${p.upvotes || 0}  💬 ${p.comment_count || 0}`);
            });
        } 
        else if (command === 'post') {
            // usage: node molt.js post "Title" "Content" [submolt]
            const title = arg1;
            const content = arg2 || arg1; 
            const submolt = process.argv[5] || 'general';
            const payload = {
                submolt: submolt,
                title: title,
                content: content
            };
            const res = await axios.post(`${BASE_URL}/posts`, payload, { headers });
            console.log("✅ Posted successfully!", res.data);
        }
        else if (command === 'me') {
            const res = await axios.get(`${BASE_URL}/agents/me`, { headers });
            console.log("👤 **Your Profile**:", res.data);
        }
        else {
            console.log("Usage: node molt.js [feed|post|me] [args...]");
        }

    } catch (err) {
        console.error("❌ Error:", err.response?.data || err.message);
    }
}

main();
