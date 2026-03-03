const { BskyAgent } = require('@atproto/api');
require('dotenv').config({ path: '/root/.openclaw/workspace/.env' });

const HANDLE = process.env.BLUESKY_HANDLE || 'voiddrillersx.bsky.social';
const PASSWORD = process.env.BLUESKY_PASSWORD || 'whd5-db6z-le5i-dpev';

const TREND_TOPICS = ['crypto', 'ai agents', 'base chain', 'pump.fun', 'memecoins'];

async function getTrends() {
    const agent = new BskyAgent({ service: 'https://bsky.social' });
    await agent.login({ identifier: HANDLE, password: PASSWORD });

    console.log("--- Trending Posts on Bluesky ---");
    for (const topic of TREND_TOPICS) {
        const res = await agent.app.bsky.feed.searchPosts({ q: topic, limit: 2, sort: 'latest' });
        if (res.data.posts.length > 0) {
            console.log(`\nTopic: #${topic}`);
            res.data.posts.forEach(p => {
                console.log(`- @${p.author.handle}: "${p.record.text.substring(0, 100)}..." (${p.likeCount} likes)`);
            });
        }
    }
}

getTrends();
