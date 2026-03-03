const { BskyAgent } = require('@atproto/api');
require('dotenv').config({ path: '/root/.openclaw/workspace/.env' });

const agent = new BskyAgent({
  service: 'https://bsky.social'
});

async function main() {
  const handle = process.env.BLUESKY_HANDLE; // 'voiddrillersx.bsky.social'
  const password = process.env.BLUESKY_PASSWORD; // 'whd5-db6z-le5i-dpev'

  try {
    // 1. Login
    await agent.login({ identifier: handle, password: password });
    console.log(`✅ Logged in as ${handle}`);

    const command = process.argv[2];
    const text = process.argv[3];

    // 2. Post
    if (command === 'post') {
      if (!text) {
        console.error("❌ Provide text to post.");
        return;
      }
      const res = await agent.post({
        text: text,
        createdAt: new Date().toISOString()
      });
      console.log(`🎉 Posted! URI: ${res.uri}`);
    } 
    // 3. Feed (Read Timeline)
    else if (command === 'feed') {
      const timeline = await agent.getTimeline({ limit: 5 });
      console.log("\n🦋 **Bluesky Timeline** 🦋\n");
      timeline.data.feed.forEach(item => {
        const post = item.post;
        console.log(`--------------------------------------------------`);
        console.log(`👤 @${post.author.handle}: ${post.record.text}`);
        console.log(`❤️ ${post.likeCount || 0}  🔄 ${post.repostCount || 0}`);
      });
    }
    else {
      console.log("Usage: node bluesky_engage.js [post|feed] [text]");
    }

  } catch (e) {
    console.error("❌ Error:", e.message);
  }
}

main();
