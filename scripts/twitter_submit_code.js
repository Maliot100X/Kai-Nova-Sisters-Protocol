const { Scraper } = require('agent-twitter-client');
const fs = require('fs');

async function submitCode() {
    const code = process.argv[2];
    if (!code) {
        console.log("No code provided.");
        return;
    }

    const scraper = new Scraper();
    const username = 'GojoSatoruamv';
    const password = 'Milekako122!!';
    const email = 'motivforyou992@gmail.com';

    console.log(`[HANDSHAKE] Submitting 6-digit code for ${username}...`);
    
    try {
        // The library handles the state, but we might need to re-run the login 
        // if the session wasn't preserved. Most scraper libs require the login 
        // call to be interrupted or handle the 2FA prompt.
        // Let's assume the scraper can take the code.
        await scraper.login(username, password, email, undefined, undefined, code);
        
        if (await scraper.isLoggedIn()) {
            console.log("[SUCCESS] Twitter Grid Synchronized.");
            const cookies = await scraper.getCookies();
            fs.writeFileSync('twitter_cookies.json', JSON.stringify(cookies));
            console.log("COOKIES SAVED.");
        } else {
            console.log("[FAILURE] Still not logged in.");
        }
    } catch (error) {
        console.error("[ERROR]:", error.message);
    }
}

submitCode();
