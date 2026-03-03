const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const { totp } = require('otplib');
const fs = require('fs');
require('dotenv').config();

puppeteer.use(StealthPlugin());

const USERNAME = 'VoidDrillersX';
const PASSWORD = 'Milekakko122!!';
const EMAIL = 'minirindia@gmail.com';
const TOTP_SECRET = 'ISEUTHMRTTFBRYFS';

async function run() {
    console.log("🕵️ Starting Diagnostic Breach...");
    const browser = await puppeteer.launch({
        headless: "new",
        executablePath: "/usr/bin/google-chrome-stable",
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720 });

    try {
        await page.goto('https://x.com/i/flow/login', { waitUntil: 'networkidle2' });
        
        console.log("👤 Typing Username...");
        await page.waitForSelector('input[autocomplete="username"]');
        await page.type('input[autocomplete="username"]', USERNAME);
        await page.keyboard.press('Enter');
        
        await new Promise(r => setTimeout(r, 5000));
        
        const bodyText = await page.evaluate(() => document.body.innerText);
        console.log("📄 PAGE TEXT AFTER USERNAME:");
        console.log("----------------------------");
        console.log(bodyText);
        console.log("----------------------------");

        await page.screenshot({ path: '/root/.openclaw/workspace/media/x_diagnostic.png' });

        if (bodyText.includes('Enter your phone number or email address') || bodyText.includes('Verify your identity')) {
            console.log("🛡️ Secondary Verification Found. Injecting Email...");
            await page.type('input', EMAIL); // Generic input since testid might change
            await page.keyboard.press('Enter');
            await new Promise(r => setTimeout(r, 3000));
        }

        console.log("🔑 Checking for Password field...");
        const hasPassword = await page.$('input[name="password"]');
        if (hasPassword) {
            await page.type('input[name="password"]', PASSWORD);
            await page.keyboard.press('Enter');
            await new Promise(r => setTimeout(r, 5000));
        } else {
            console.log("❌ Password field not found.");
        }

        await page.screenshot({ path: '/root/.openclaw/workspace/media/x_final_diagnostic.png' });

    } catch (e) {
        console.error("❌ Error:", e.message);
    } finally {
        await browser.close();
        console.log("🚢 Diagnostic End.");
    }
}

run();
