const { google } = require('googleapis');
require('dotenv').config({ path: '/root/.openclaw/workspace/.env' });
const fs = require('fs');

async function testBlogger() {
  const creds = JSON.parse(fs.readFileSync('/root/.openclaw/workspace/system/google_creds.json', 'utf8'));
  
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

  oauth2Client.setCredentials({
    refresh_token: creds.refresh_token
  });

  const blogger = google.blogger({ version: 'v3', auth: oauth2Client });

  try {
    console.log("Fetching user info...");
    const userRes = await blogger.users.get({ userId: 'self' });
    console.log(`Connected as: ${userRes.data.displayName}`);

    console.log("Listing blogs...");
    const blogRes = await blogger.blogs.listByUser({ userId: 'self' });
    const blogs = blogRes.data.items || [];
    
    blogs.forEach(b => {
      console.log(`- Blog: ${b.name} | ID: ${b.id} | URL: ${b.url}`);
    });
    
    if (blogs.length > 0) {
      creds.blog_id = blogs[0].id; // Save first blog as default
      fs.writeFileSync('/root/.openclaw/workspace/system/google_creds.json', JSON.stringify(creds, null, 2));
      console.log(`Default Blog ID saved: ${blogs[0].id}`);
    }

  } catch (e) {
    console.error("Blogger Test Error:", e.message);
  }
}

testBlogger();
