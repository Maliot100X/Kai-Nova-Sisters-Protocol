const { BskyAgent } = require('@atproto/api');
require('dotenv').config({ path: '/root/.openclaw/workspace/.env' });

const HANDLE = process.env.BLUESKY_HANDLE;
const PASSWORD = process.env.BLUESKY_PASSWORD;

async function check() {
    const agent = new BskyAgent({ service: 'https://bsky.social' });
    await agent.login({ identifier: HANDLE, password: PASSWORD });
    
    const topics = ['ai agents', 'base chain', 'pump.fun', 'memecoins'];
    for (const topic of topics) {
        console.log(`--- Topic: ${topic} ---`);
        const res = await agent.app.bsky.feed.searchPosts({ q: topic, limit: 10 });
        res.data.posts.forEach(p => {
            if (p.likeCount > 20) {
                console.log(`🔥 [${p.likeCount} likes] @${p.author.handle}: ${p.record.text.replace(/\n/g, ' ')}`);
            }
        });
    }
}
check();
