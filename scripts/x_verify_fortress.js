const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const fs = require('fs');
require('dotenv').config();

puppeteer.use(StealthPlugin());

const COOKIE_FILE = '/root/.openclaw/workspace/memory/x_session.json';

async function run() {
    console.log("🏗️ Verifying Fortress Integrity...");
    const browser = await puppeteer.launch({
        headless: "new",
        executablePath: "/usr/bin/google-chrome-stable",
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720 });

    try {
        if (fs.existsSync(COOKIE_FILE)) {
            console.log("🔑 Loading Captured Session...");
            const cookies = JSON.parse(fs.readFileSync(COOKIE_FILE, 'utf8'));
            await page.setCookie(...cookies);
        }

        console.log("📡 Navigating to X Home from Ubuntu...");
        await page.goto('https://x.com/home', { waitUntil: 'networkidle2' });
        
        await new Promise(r => setTimeout(r, 5000));

        console.log("📸 Capturing Proof of Life...");
        await page.screenshot({ path: '/root/.openclaw/workspace/media/x_fortress_proof.png' });
        
        const loggedIn = await page.evaluate(() => document.body.innerText.includes('Home') || !!document.querySelector('[data-testid="SideNav_AccountSwitcher_Button"]'));
        if (loggedIn) {
            console.log("🏆 FORTRESS VERIFIED: Active on Ubuntu.");
        } else {
            console.log("⚠️ Fortress Locked: Session may need refresh.");
        }

    } catch (e) {
        console.error("❌ Error:", e.message);
    } finally {
        await browser.close();
    }
}

run();
