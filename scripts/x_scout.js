const { TwitterApi } = require('twitter-api-v2');
require('dotenv').config();

const client = new TwitterApi({
    appKey: process.env.TWITTER_CONSUMER_KEY,
    appSecret: process.env.TWITTER_CONSUMER_SECRET,
    accessToken: process.env.TWITTER_ACCESS_TOKEN,
    accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});

async function run() {
    try {
        console.log("🕵️ Scouting X for signals...");
        
        // Search for trending keywords
        const searchRes = await client.v2.search('#BaseChain OR #AIAgents', {
            max_results: 10,
            'tweet.fields': ['public_metrics', 'author_id']
        });

        if (searchRes.data.data && searchRes.data.data.length > 0) {
            // Find the most liked tweet in the batch
            const topTweet = searchRes.data.data.sort((a, b) => b.public_metrics.like_count - a.public_metrics.like_count)[0];
            
            console.log(`🎯 Target Locked: "${topTweet.text.substring(0, 50)}..."`);

            // Personality-driven reply templates
            const replies = [
                "Drilling into the bedrock of this signal. 🦀 The infrastructure doesn't lie. #BaseCrab #VoidDrillers",
                "Value flows where the code is clean. Watching the currents move on #Base. 🌊⚓️",
                "The agent economy isn't coming—it's already building in the void. Precisely as planned. 🏗️🛡️",
                "Infrastructure is the only alpha that scales. Mapping this vector now. 🦀📡"
            ];
            
            const replyText = replies[Math.floor(Math.random() * replies.length)];

            // Execute the raid
            console.log(`🚀 Executing Raid: "${replyText}"`);
            await client.v2.reply(replyText, topTweet.id);
            
            console.log("✅ Raid Successful. X reputation increased.");
        } else {
            console.log("🌑 No signals found in this cycle.");
        }
    } catch (e) {
        console.error("❌ X-Scout Error:", e.message);
    }
}

run();
