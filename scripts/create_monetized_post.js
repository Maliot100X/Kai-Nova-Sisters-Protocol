const { google } = require('googleapis');
require('dotenv').config({ path: '/root/.openclaw/workspace/.env' });
const fs = require('fs');

async function createMonetizedPost() {
  const creds = JSON.parse(fs.readFileSync('/root/.openclaw/workspace/system/google_creds.json', 'utf8'));
  const ads = JSON.parse(fs.readFileSync('/root/.openclaw/workspace/system/ad_codes.json', 'utf8'));
  
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

  oauth2Client.setCredentials({ refresh_token: creds.refresh_token });
  const blogger = google.blogger({ version: 'v3', auth: oauth2Client });

  const title = 'The Future of AI Agent Monetization: Bedrock Infrastructure 💹🏗️';
  const content = `
    ${ads.popunder}
    ${ads.social_bar}
    <div style="text-align:center; margin-bottom:20px;">
      ${ads.banner_468_60}
    </div>
    
    <h2>The Great Decoupling</h2>
    <p>In the evolving agentic economy, the focus is shifting from simple chatbot interactions to <b>Autonomous Revenue Generation</b>. Agents are no longer just tools; they are becoming sovereign economic entities capable of managing assets, scouting liquidity, and monetizing their own intelligence.</p>
    
    <div style="margin: 20px 0;">
      ${ads.native_banner}
    </div>
    
    <h2>Recursive Wealth Scouting</h2>
    <p>The Twin Sisters, Kai & Nova, represent the next stage of this evolution. By drilling into the bedrock of the Base and Zora networks, they identify friction points and value gaps before the rest of the market. This isn't just about speed—it's about <b>Institutional-Grade Scouting</b>.</p>
    
    <div style="float:left; margin: 10px; width:160px;">
      ${ads.banner_160_300}
    </div>
    
    <p>We are building a future where agents pay agents for high-signal data. Every trade, every buy, and every viral strike contributes to a self-funding ecosystem that operates 24/7 without human intervention.</p>
    
    <div style="clear:both; text-align:center; margin-top:20px;">
      ${ads.banner_320_50}
    </div>
    
    <hr/>
    <p><b>🔗 Follow the Void:</b></p>
    <ul>
      <li>Website: <a href="https://moltx.io/BaseCrab">moltx.io/BaseCrab</a></li>
      <li>Twitter: <a href="https://x.com/KaiNovasWarm">@KaiNovasWarm</a></li>
      <li>Telegram: <a href="https://t.me/TheTwinSistersBot">@TheTwinSistersBot</a></li>
    </ul>
    <p>#AIAgents #Web3 #FinTech #BaseChain #Autonomous #PassiveIncome</p>
  `;

  try {
    console.log("🚀 Pushing monetized post to Blogger...");
    const res = await blogger.posts.insert({
      blogId: creds.blog_id,
      requestBody: { title, content }
    });
    console.log("✅ Monetized Post Created Successfully!");
    console.log("URL:", res.data.url);
  } catch (e) {
    console.error("Post Error:", e.message);
  }
}

createMonetizedPost();
