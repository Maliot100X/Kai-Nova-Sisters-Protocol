const { Scraper } = require('agent-twitter-client');
const fs = require('fs');

async function testLogin() {
    const scraper = new Scraper();
    const username = 'GojoSatoruamv';
    const password = 'Milekako122!!';
    const email = 'motivforyou992@gmail.com';

    console.log(`[HANDSHAKE] Attempting login for ${username}...`);
    
    try {
        await scraper.login(username, password, email);
        
        if (await scraper.isLoggedIn()) {
            console.log("[SUCCESS] Twitter Grid Synchronized.");
            const cookies = await scraper.getCookies();
            fs.writeFileSync('twitter_cookies.json', JSON.stringify(cookies));
        } else {
            console.log("[WAIT] Handshake requires verification.");
        }
    } catch (error) {
        if (error.message.includes("code") || error.message.includes("verification")) {
            console.log("[ALERT] 6-DIGIT CODE REQUIRED. CHECK EMAIL.");
            // We don't throw, just log so the agent knows to ask the user
        } else {
            console.error("[ERROR] Connection Refused:", error.message);
        }
    }
}

testLogin();
