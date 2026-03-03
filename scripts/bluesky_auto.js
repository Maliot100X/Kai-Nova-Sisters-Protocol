const { BskyAgent } = require('@atproto/api');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '/root/.openclaw/workspace/.env' });

// Config
const HANDLE = process.env.BLUESKY_HANDLE || 'voiddrillersx.bsky.social';
const PASSWORD = process.env.BLUESKY_PASSWORD || 'whd5-db6z-le5i-dpev';
const HISTORY_FILE = '/root/.openclaw/workspace/bluesky_history.json';

// Trends to target
const TREND_TOPICS = [
    'crypto', 'ai agents', 'base chain', 'pump.fun', 'memecoins', 'bnb', 'defi', 'web3', 'dao'
];

const AGENT = new BskyAgent({ service: 'https://bsky.social' });

// Load history
function loadHistory() {
    try {
        if (fs.existsSync(HISTORY_FILE)) {
            return JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf8'));
        }
    } catch (e) {}
    return { 
        daily_posts: 0, 
        last_post_date: null, 
        followed_today: 0, 
        last_follow_date: null,
        reposts: [] // { uri: string, date: string }
    };
}

function saveHistory(history) {
    fs.writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2));
}

// Check Daily Limits
function checkLimits(history) {
    const today = new Date().toISOString().split('T')[0];
    
    // Reset daily counters
    if (history.last_post_date !== today) {
        history.daily_posts = 0;
        history.last_post_date = today;
    }
    if (history.last_follow_date !== today) {
        history.followed_today = 0;
        history.last_follow_date = today;
    }
    
    saveHistory(history);
    return history;
}

// Generate Viral Content (No Image Gen yet, text focused)
function generatePost(topic) {
    const templates = [
        `The agents are waking up. 🤖 It's not just code anymore, it's an economy. #${topic.replace(' ', '')} #AI #Web3`,
        `Liquidity flows where attention goes. 🌊 Watching the ${topic} currents shift in real-time. #Base #Crypto`,
        `Building in the void. 🏗️ If you're not automating, you're stagnating. #${topic.replace(' ', '')} #Automation`,
        `Trust is the only currency that scales. Verify everything. #${topic.replace(' ', '')} #DeFi`,
        `Infrastructure is the new alpha. 🦀 Drilling deep into ${topic}.`
    ];
    return templates[Math.floor(Math.random() * templates.length)];
}

async function run() {
    try {
        await AGENT.login({ identifier: HANDLE, password: PASSWORD });
        console.log(`✅ Logged in as ${HANDLE}`);

        let history = loadHistory();
        history = checkLimits(history);

        // --- ACTION 1: CLEANUP OLD REPOSTS (Run every time) ---
        const now = new Date();
        const keptReposts = [];
        for (const repost of history.reposts) {
            const repostTime = new Date(repost.date);
            const ageHours = (now - repostTime) / (1000 * 60 * 60);
            
            if (ageHours > 24) {
                console.log(`🗑️ Deleting old repost: ${repost.uri}`);
                // Delete logic would go here if API supports easy undo, for now just removing from tracking
                // Bsky undo is deleteRecord
            } else {
                keptReposts.push(repost);
            }
        }
        history.reposts = keptReposts;

        // --- ACTION 2: POST (Max 3/day) ---
        if (history.daily_posts < 3) {
            // 30% chance to post now (spreads it out)
            if (Math.random() < 0.3) {
                const topic = TREND_TOPICS[Math.floor(Math.random() * TREND_TOPICS.length)];
                const text = generatePost(topic);
                
                console.log(`📝 Posting: "${text}"`);
                await AGENT.post({
                    text: text,
                    createdAt: new Date().toISOString()
                });
                
                history.daily_posts++;
                console.log(`✅ Posted! (${history.daily_posts}/3 today)`);
            }
        } else {
            console.log("🛑 Daily post limit reached.");
        }

        // --- ACTION 3: ENGAGE (Reply/Like/Follow) ---
        // Search for trending topic
        const topic = TREND_TOPICS[Math.floor(Math.random() * TREND_TOPICS.length)];
        const searchRes = await AGENT.app.bsky.feed.searchPosts({ q: topic, limit: 10 });
        
        if (searchRes.data.posts.length > 0) {
            console.log(`🔥 Trending posts for "${topic}":`);
            searchRes.data.posts.forEach(p => {
                console.log(`- [@${p.author.handle}]: ${p.record.text.replace(/\n/g, ' ').substring(0, 50)}... (${p.likeCount} likes)`);
            });

            // Filter good posts
            const target = searchRes.data.posts.find(p => p.likeCount > 5); // Must have some engagement
            
            if (target) {
                console.log(`🎯 Engaging with post about ${topic}...`);
                
                // Like
                await AGENT.like(target.uri, target.cid);
                console.log("✅ Liked.");

                // Follow (Max 3/day)
                if (history.followed_today < 3 && Math.random() < 0.2) {
                    await AGENT.follow(target.author.did);
                    history.followed_today++;
                    console.log(`👣 Followed @${target.author.handle} (${history.followed_today}/3 today)`);
                }
            }
        }

        saveHistory(history);

    } catch (e) {
        console.error("❌ Error:", e.message);
    }
}

run();
