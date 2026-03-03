const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
require('dotenv').config();

puppeteer.use(StealthPlugin());

async function run() {
    console.log("🏗️ Final Breach Attempt: Matching Fingerprint...");
    const browser = await puppeteer.launch({
        headless: "new",
        executablePath: "/usr/bin/google-chrome-stable",
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    
    // Exact match for Commander's browser
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

    try {
        console.log("📡 Navigating to X Home...");
        await page.goto('https://x.com/home', { waitUntil: 'networkidle2' });
        await new Promise(r => setTimeout(r, 8000));
        
        await page.screenshot({ path: '/root/.openclaw/workspace/media/x_fingerprint_check.png' });
        
        const bodyText = await page.evaluate(() => document.body.innerText);
        if (bodyText.includes('Home')) {
            console.log("🏆 SUCCESS! Fingerprint matched.");
        } else {
            console.log("❌ Failed. X still blocking.");
        }

    } catch (e) {
        console.error("❌ Error:", e.message);
    } finally {
        await browser.close();
    }
}

run();
