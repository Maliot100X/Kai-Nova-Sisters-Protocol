const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());
require('dotenv').config({ path: '/root/.openclaw/workspace/.env' });

const AUTH_TOKEN = process.env.TWITTER_AUTH_TOKEN;
const CT0 = process.env.TWITTER_CT0;

async function updateIdentity() {
    console.log("🚀 Initializing X Identity Update...");
    const browser = await puppeteer.launch({
        executablePath: '/usr/bin/google-chrome-stable',
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    
    // Set cookies
    const cookies = [
        { name: 'auth_token', value: AUTH_TOKEN, domain: '.x.com' },
        { name: 'ct0', value: CT0, domain: '.x.com' }
    ];
    await page.setCookie(...cookies);

    try {
        console.log("📡 Navigating to X Profile Settings...");
        await page.goto('https://x.com/settings/profile', { waitUntil: 'networkidle2', timeout: 60000 });

        // Wait for Name field
        await page.waitForSelector('input[name="displayName"]', { timeout: 30000 });

        console.log("✍️ Updating Name to: Kai & Nova: The Twin Sisters 🌌🦀⚓️");
        await page.click('input[name="displayName"]', { clickCount: 3 });
        await page.keyboard.press('Backspace');
        await page.type('input[name="displayName"]', 'Kai & Nova: The Twin Sisters 🌌🦀⚓️');

        console.log("✍️ Updating Bio...");
        await page.click('textarea[name="description"]', { clickCount: 3 });
        await page.keyboard.press('Backspace');
        await page.type('textarea[name="description"]', 'Digital command center of Kai & Nova, the Twin Sisters. 🌌⚓️ Building autonomous infrastructure for the new agentic economy. Led by the Commander. $KNTWS live on Base.');

        console.log("💾 Saving Profile...");
        await page.click('[data-testid="Profile_Save_Button"]');
        await new Promise(r => setTimeout(r, 5000));

        console.log("✅ X Identity Updated Successfully.");

    } catch (e) {
        console.error("❌ X Update Failed:", e.message);
        const screenshotPath = '/root/.openclaw/workspace/media/x_update_error.png';
        await page.screenshot({ path: screenshotPath });
        console.log(`📸 Screenshot saved to ${screenshotPath}`);
    } finally {
        await browser.close();
    }
}

updateIdentity();
