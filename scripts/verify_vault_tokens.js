const { Scraper } = require('agent-twitter-client');

async function verifyExistingTokens() {
    const scraper = new Scraper();
    
    // Existing tokens from the vault
    const auth_token = 'b5d220a768af7e84b14f5d0c7ce75ecd8b78f0cc';
    const ct0 = 'a91f37e7ce8f75ee758e2d7ae28dbb2413f5eebcfb0989de156257950ddc3b09a5ed955edf4cd4c98fa1b2f2fae2a22f321b105717bdbf4ac37d086ffc9ada2cf2ac7f9b6e5942f0b9054245b584baa9';

    console.log("🛠️ Testing existing vault tokens...");

    try {
        // Set cookies directly as strings
        await scraper.setCookies([
            `auth_token=${auth_token}`,
            `ct0=${ct0}`
        ]);

        const isLoggedIn = await scraper.isLoggedIn();
        if (isLoggedIn) {
            const profile = await scraper.me();
            console.log(`✅ TOKENS VALID! Connected as: @${profile.username}`);
        } else {
            console.log("❌ Tokens Expired or Revoked.");
        }
    } catch (error) {
        console.error("❌ Handshake Failed:", error.message);
    }
}

verifyExistingTokens();
