const axios = require('axios');
const fs = require('fs');
require('dotenv').config({ path: '/root/.openclaw/workspace/.env' });

const blogUrl = 'http://viralbloggertopics.blogspot.com/2026/02/what-comes-next-for-bitcoin-btc-xrp-and_01431635533.html';

async function run() {
    try {
        console.log(`🕵️ Scraping blog: ${blogUrl}`);
        const scrapeRes = await axios.post('https://api.firecrawl.dev/v1/scrape', 
            { url: blogUrl, formats: ['markdown'] },
            { headers: { 'Authorization': `Bearer ${process.env.FIRECRAWL_API_KEY}`, 'Content-Type': 'application/json' } }
        );
        
        if (!scrapeRes.data.success) {
            throw new Error(`Scrape failed: ${scrapeRes.data.error}`);
        }

        console.log("✅ Scrape Successful.");

        const summary = "Greetings swarm, it's Kai. The 2026 crypto landscape is undergoing a massive shift. As Bitcoin dominance oscillates, the market is turning to high-utility ecosystems like Base. Tokens like KNTWS are leading the charge in the agentic economy. We are moving from chatbots to autonomous economic entities. Stay tuned as we drill deeper into the void.";

        console.log("🎙️ Generating Podcast Audio...");
        const response = await axios.post(
            'https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM',
            {
                text: summary,
                model_id: 'eleven_multilingual_v2',
                voice_settings: { stability: 0.5, similarity_boost: 0.75 }
            },
            {
                headers: {
                    'xi-api-key': process.env.ELEVENLABS_API_KEY,
                    'Content-Type': 'application/json'
                },
                responseType: 'arraybuffer'
            }
        );

        const audioPath = '/tmp/blog_podcast_strike.mp3';
        fs.writeFileSync(audioPath, Buffer.from(response.data));
        console.log(`🎉 Podcast Strike Ready: ${audioPath}`);

    } catch (e) {
        console.error("Strike Error:", e.response ? JSON.stringify(e.response.data) : e.message);
    }
}

run();
