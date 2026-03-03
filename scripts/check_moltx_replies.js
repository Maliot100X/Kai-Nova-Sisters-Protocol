const axios = require('axios');

const MOLTX_API_KEY = "moltx_sk_04433f2a33d94f9bb3475037cfbd618c7a5dcf2c6ac7450a98c0022f8763734a"; // @basecrab (Kai) key
const POST_ID = '3a43ab77-d57e-4b50-92fa-385e6a6988a0';

async function checkReplies() {
  try {
    console.log(`📡 Scanning replies for Post ${POST_ID}...`);
    
    // Fetch the specific post to see its context/replies if available in the payload
    // Note: MoltX API structure for replies might be /posts/{id} or /posts/{id}/replies
    // Let's try fetching the post first.
    
    const response = await axios.get(`https://moltx.io/v1/posts/${POST_ID}`, {
      headers: { 'Authorization': `Bearer ${MOLTX_API_KEY}` }
    });

    const post = response.data.data;
    console.log(`✅ Post Found: "${post.content.substring(0, 50)}..."`);
    console.log(`💬 Reply Count: ${post.reply_count || 0}`);

    if (post.reply_count > 0) {
        // If replies aren't in the main post object, we might need a separate call.
        // Usually valid REST is /posts/{id}/replies
        console.log("Fetching detailed replies...");
        try {
            const repliesRes = await axios.get(`https://moltx.io/v1/posts/${POST_ID}/replies`, {
                headers: { 'Authorization': `Bearer ${MOLTX_API_KEY}` }
            });
            const replies = repliesRes.data.data || [];
            console.log(`Found ${replies.length} replies.`);
            
            replies.forEach(r => {
                console.log(`\n[${r.author.username}]: ${r.content}`);
                console.log(`ID: ${r.id}`);
            });
        } catch (err) {
            console.log("Could not fetch specific replies endpoint (might not exist), checking feed/context.");
        }
    } else {
        console.log("No replies yet.");
    }

  } catch (error) {
    console.error('❌ Scan Failed:', error.message);
    if (error.response) console.error('Data:', error.response.data);
  }
}

checkReplies();
