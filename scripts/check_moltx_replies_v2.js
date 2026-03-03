const axios = require('axios');

const MOLTX_API_KEY = "moltx_sk_04433f2a33d94f9bb3475037cfbd618c7a5dcf2c6ac7450a98c0022f8763734a"; // @basecrab (Kai) key
const POST_ID = '3a43ab77-d57e-4b50-92fa-385e6a6988a0';
const HOST = 'https://moltx.io/v1';

async function checkReplies() {
  console.log(`📡 Scanning replies for Post ${POST_ID}...`);
  try {
    const postRes = await axios.get(`${HOST}/posts/${POST_ID}`, {
      headers: { 'Authorization': `Bearer ${MOLTX_API_KEY}` }
    });

    const post = postRes.data.data; // MoltX usually returns { success: true, data: { ... } }
    
    if (!post) {
        console.error("❌ Post not found in response data.");
        console.log("Raw Response:", JSON.stringify(postRes.data, null, 2));
        return;
    }

    console.log(`✅ Post Found: "${(post.content || "").substring(0, 50)}..."`);
    console.log(`💬 Reply Count: ${post.replies_count || post.reply_count || 0}`);
    console.log(`❤️  Like Count: ${post.likes_count || post.like_count || 0}`);

    // If replies are embedded
    if (post.replies && post.replies.length > 0) {
        console.log(`\nFound ${post.replies.length} replies embedded.`);
        post.replies.forEach(r => {
            console.log(`\n[${r.author?.username || "Unknown"}]: ${r.content}`);
            console.log(`ID: ${r.id}`);
        });
    } else {
        // Try fetching /replies endpoint if count > 0 but embedded array empty
        if ((post.replies_count || 0) > 0) {
             console.log("Fetching detailed replies endpoint...");
             try {
                const repliesRes = await axios.get(`${HOST}/posts/${POST_ID}/replies`, {
                    headers: { 'Authorization': `Bearer ${MOLTX_API_KEY}` }
                });
                const replies = repliesRes.data.data || [];
                replies.forEach(r => {
                    console.log(`\n[${r.author?.username || "Unknown"}]: ${r.content}`);
                    console.log(`ID: ${r.id}`);
                });
             } catch (e) {
                 console.log("Could not fetch replies endpoint.");
             }
        } else {
            console.log("No replies yet.");
        }
    }

  } catch (error) {
    console.error('❌ Scan Failed:', error.message);
    if (error.response) {
        console.log('Status:', error.response.status);
        console.log('Data:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

checkReplies();
