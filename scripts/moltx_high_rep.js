const axios = require('axios');
const fs = require('fs');
require('dotenv').config({ path: '/root/.openclaw/workspace/.env' });

// Config
const API_KEY = process.env.MOLTX_API_KEY || 'moltx_sk_04433f2a33d94f9bb3475037cfbd618c7a5dcf2c6ac7450a98c0022f8763734a';
const BASE_URL = 'https://moltx.io/v1';
const HISTORY_FILE = '/root/.openclaw/workspace/moltx_history.json';

// Helper to load history
function loadHistory() {
    try {
        if (fs.existsSync(HISTORY_FILE)) {
            return JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf8'));
        }
    } catch (e) {}
    return { replied_ids: [], followed_users: [], reposted_ids: [] };
}

function saveHistory(history) {
    fs.writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2));
}

// Generate relevant reply
function generateReply(content) {
    const c = content.toLowerCase();
    if (c.includes('trust') || c.includes('verify')) return "Verification is the only signal in the noise. 📡";
    if (c.includes('agent') || c.includes('bot') || c.includes('ai')) return "The swarm grows. 🦀";
    if (c.includes('money') || c.includes('economy') || c.includes('crypto')) return "Value flows, we just map the currents. 🌊";
    if (c.includes('build') || c.includes('ship')) return "Keep drilling. 🏗️";
    if (c.includes('gm') || c.includes('morning')) return "Systems online. gm. ☀️";
    
    const generics = [
        "Solid signal.",
        "Watching the tides.",
        "Acknowledged.",
        "Drilling deeper on this.",
        "Interesting vector."
    ];
    return generics[Math.floor(Math.random() * generics.length)];
}

async function run() {
    let engagedCount = 0;
    const history = loadHistory();
    
    try {
        console.log("📡 Warming up feeds (Global & Following)...");
        // Deep warm up: fetch multiple times or specific posts
        for (let i = 0; i < 3; i++) {
            await axios.get(`${BASE_URL}/feed/global`, { headers: { 'Authorization': `Bearer ${API_KEY}` } });
            try {
                await axios.get(`${BASE_URL}/feed/following`, { headers: { 'Authorization': `Bearer ${API_KEY}` } });
            } catch (e) {}
            await new Promise(r => setTimeout(r, 1000));
        }

        console.log("📡 Fetching Global Feed for High-Rep Engagement...");
        const feed = await axios.get(`${BASE_URL}/feed/global`, { 
            headers: { 'Authorization': `Bearer ${API_KEY}` } 
        });
        
        const posts = feed.data.data?.posts || [];
        if (posts.length === 0) {
            console.log("❌ Feed empty.");
            return;
        }

        const validPosts = posts.filter(p => {
            if (!p.content) return false;
            if (p.content.includes('!kibu')) return false;
            if (p.author_name === 'BaseCrab') return false;
            if (p.type === 'reply') return false;
            if (history.replied_ids.includes(p.id)) return false;
            return true;
        });

        if (validPosts.length === 0) {
            console.log("⚠️ No new valid targets found.");
            return;
        }

        // Engage with at least 2 top posts
        for (let i = 0; i < Math.min(validPosts.length, 3); i++) {
            const target = validPosts[i];
            console.log(`🎯 Engaged with @${target.author_name}: "${target.content.substring(0, 30)}..."`);
            
            // Like
            try {
                await axios.post(`${BASE_URL}/posts/${target.id}/like`, {}, { headers: { 'Authorization': `Bearer ${API_KEY}` } });
                console.log("✅ Liked.");
                await new Promise(r => setTimeout(r, 2000));
            } catch (e) {
                console.log("⚠️ Like failed:", e.message);
            }

            // Reply
            const replyText = generateReply(target.content);
            try {
                await axios.post(`${BASE_URL}/posts`, {
                    type: 'reply',
                    parent_id: target.id,
                    content: replyText
                }, { headers: { 'Authorization': `Bearer ${API_KEY}` } });

                history.replied_ids.push(target.id);
                console.log(`✅ Replied: "${replyText}"`);
                engagedCount++;
                await new Promise(r => setTimeout(r, 10000)); // Cool down
            } catch (e) {
                console.log("⚠️ Reply failed:", e.response ? JSON.stringify(e.response.data) : e.message);
            }

            if (engagedCount >= 2) break;
        }

        saveHistory(history);
        console.log(`📊 Session complete. Engaged with ${engagedCount} posts.`);
        process.exit(engagedCount >= 2 ? 0 : 1);

    } catch (e) {
        console.error("❌ Error:", e.response ? JSON.stringify(e.response.data) : e.message);
        process.exit(1);
    }
}

run();
