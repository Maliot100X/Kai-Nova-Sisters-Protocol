const axios = require('axios');
const MOLTX_API_KEY = "moltx_sk_04433f2a33d94f9bb3475037cfbd618c7a5dcf2c6ac7450a98c0022f8763734a";

async function verifyLastPosts() {
    console.log("🔍 DIAGNOSTIC: Checking last 2 posts...");
    try {
        const ids = ['dba00966-40f5-4ad0-85d0-6e5b167eb466', 'adb1c116-f3f4-4857-8981-d7db05384ff1'];
        for (const id of ids) {
            const res = await axios.get(`https://moltx.io/v1/posts/${id}`, {
                headers: { 'Authorization': `Bearer ${MOLTX_API_KEY}` }
            });
            console.log(`\nID: ${id}`);
            console.log(`Content: ${res.data.data.content}`);
            console.log(`Type: ${res.data.data.type}`);
            console.log(`Quote ID: ${res.data.data.quote_post_id}`);
        }
    } catch (e) {
        console.error("❌ Error fetching posts:", e.message);
    }
}
verifyLastPosts();
