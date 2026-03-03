const { Scraper } = require('agent-twitter-client');
const fs = require('fs');

async function finalVerify() {
    const scraper = new Scraper();
    
    const auth_token = 'e0d5882e36c96c3027ad6de5964dd6609639df6c';
    const ct0 = 'cd94aa1e4b9338a0aeb18a9fe38e73c07b2aef1f97e3002efac58ef0e4ad15ac6a40ed568ca086c85249ff200cd9a31cf253d719f82dd50b26671b040a666367ce1c309ec271655ed6a093b1c0a6d293';

    console.log("🛠️ Executing Final Session Verification...");

    try {
        // Set cookies as strings for the tough-cookie internal logic
        await scraper.setCookies([
            `auth_token=${auth_token}; Domain=.x.com; Path=/; Secure; HttpOnly`,
            `ct0=${ct0}; Domain=.x.com; Path=/; Secure`
        ]);

        const isLoggedIn = await scraper.isLoggedIn();
        if (isLoggedIn) {
            const profile = await scraper.me();
            console.log(`✅ SESSION ACTIVE: @${profile.username}`);
            console.log("GRID SYNCHRONIZED.");
            // Store cookies for the main eliza-spore engine
            const cookies = await scraper.getCookies();
            fs.writeFileSync('grid_session.json', JSON.stringify(cookies));
        } else {
            console.log("❌ Handshake Refused. Session invalidated by X.");
        }
    } catch (error) {
        console.error("❌ Handshake Error:", error.message);
    }
}

finalVerify();
