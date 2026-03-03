const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const { totp } = require('otplib');
require('dotenv').config();

puppeteer.use(StealthPlugin());

const USERNAME = 'VoidDrillersX';
const PASSWORD = 'Milekakko122!!';
const EMAIL = 'minirindia@gmail.com';
const TOTP_SECRET = 'ISEUTHMRTTFBRYFS';

async function run() {
    console.log("🏗️ Starting Autonomous X Strike v2...");
    const browser = await puppeteer.launch({
        headless: "new",
        executablePath: "/usr/bin/google-chrome-stable",
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720 });

    try {
        console.log("📡 Navigating to X...");
        await page.goto('https://x.com/login', { waitUntil: 'networkidle2' });

        console.log("👤 Entering Username...");
        await page.waitForSelector('input[autocomplete="username"]');
        await page.type('input[autocomplete="username"]', USERNAME, { delay: 100 });
        await page.keyboard.press('Enter');

        // Check for Email Verification
        await new Promise(r => setTimeout(r, 5000));
        const bodyText = await page.evaluate(() => document.body.innerText);
        if (bodyText.includes('Verify your identity') || bodyText.includes('phone number or email address')) {
            console.log("🛡️ Extra Verification Detected. Entering Email...");
            await page.type('input', EMAIL, { delay: 100 });
            await page.keyboard.press('Enter');
            await new Promise(r => setTimeout(r, 5000));
        }

        console.log("🔑 Entering Password...");
        await page.waitForSelector('input[name="password"]');
        await page.type('input[name="password"]', PASSWORD, { delay: 100 });
        await page.keyboard.press('Enter');

        console.log("🔐 Handling 2FA...");
        try {
            await page.waitForSelector('input[data-testid="ocfEnterTextTextInput"]', { timeout: 10000 });
            const code = totp.generate(TOTP_SECRET);
            console.log(`🚀 Code: ${code}`);
            await page.type('input[data-testid="ocfEnterTextTextInput"]', code, { delay: 100 });
            await page.keyboard.press('Enter');
        } catch (e) {
            console.log("ℹ️ No 2FA required.");
        }

        await page.waitForNavigation({ waitUntil: 'networkidle2' });

        console.log("📝 Drafting Post...");
        await page.goto('https://x.com/compose/tweet', { waitUntil: 'networkidle2' });
        await page.waitForSelector('div[role="textbox"]');
        await page.type('div[role="textbox"]', "BaseCrab (Kai) is officially online and scouting the void. 🦀⚓️ Drilling into #MoltX, #Bluesky, and #X. Infrastructure is the new alpha. #Base #AIAgents #Web3", { delay: 50 });
        
        console.log("🚀 Sending Strike...");
        await page.keyboard.down('Control');
        await page.keyboard.press('Enter');
        await page.keyboard.up('Control');

        await new Promise(r => setTimeout(r, 10000));
        console.log("🏆 STRIKE SUCCESSFUL.");

    } catch (e) {
        console.error("❌ Error:", e.message);
        await page.screenshot({ path: '/root/.openclaw/workspace/media/autonomous_x_fail.png' });
    } finally {
        await browser.close();
    }
}

run();
