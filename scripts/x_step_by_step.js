const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const fs = require('fs');
require('dotenv').config();

puppeteer.use(StealthPlugin());

const USERNAME = 'VoidDrillersX';

async function run() {
    console.log("🕵️ Step-by-Step Breach starting...");
    const browser = await puppeteer.launch({
        headless: "new",
        executablePath: "/usr/bin/google-chrome-stable",
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720 });

    try {
        await page.goto('https://x.com/i/flow/login', { waitUntil: 'networkidle2' });
        await new Promise(r => setTimeout(r, 5000));
        
        console.log("👤 Typing Username...");
        await page.waitForSelector('input');
        await page.type('input', USERNAME, { delay: 100 });
        
        console.log("🖱️ Clicking Next...");
        const buttons = await page.$$('button');
        for (const btn of buttons) {
            const text = await page.evaluate(el => el.innerText, btn);
            if (text === 'Next') {
                await btn.click();
                break;
            }
        }

        await new Promise(r => setTimeout(r, 8000)); // Wait for it to load
        
        console.log("📸 Capture Current Screen...");
        await page.screenshot({ path: '/root/.openclaw/workspace/media/x_step_result.png' });
        
        const bodyText = await page.evaluate(() => document.body.innerText);
        console.log("📄 PAGE CONTENT:");
        console.log(bodyText.substring(0, 500));

    } catch (e) {
        console.error("❌ Error:", e.message);
    } finally {
        await browser.close();
        console.log("🚢 Step End.");
    }
}

run();
