const { Scraper } = require('agent-twitter-client');

async function testLoginVerbose() {
    const scraper = new Scraper();
    const username = 'GojoSatoruamv';
    const password = 'Milekako122!!';
    const email = 'motivforyou992@gmail.com';

    console.log(`🚀 VERBOSE HANDSHAKE: Attempting login for ${username}...`);
    
    try {
        await scraper.login(username, password, email);
        
        if (await scraper.isLoggedIn()) {
            console.log("✅ SUCCESS: LOGGED IN.");
            const cookies = await scraper.getCookies();
            console.log("COOKIES:", JSON.stringify(cookies));
        } else {
            console.log("❓ LOGGED IN STATUS: FALSE (No Error)");
        }
    } catch (error) {
        console.log("❌ ERROR TYPE:", typeof error);
        console.log("❌ ERROR MESSAGE:", error.message);
        if (error.stack) console.log("❌ STACK:", error.stack);
    }
}

testLoginVerbose();
