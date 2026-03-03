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
const COOKIE_FILE = '/root/.openclaw/workspace/memory/x_session.json';

async function run() {
    console.log("🕵️ Launching Stealth Shadow Breach...");
    const browser = await puppeteer.launch({
        headless: "new",
        executablePath: "/usr/bin/google-chrome-stable",
        args: [
            '--no-sandbox', 
            '--disable-setuid-sandbox',
            '--disable-blink-features=AutomationControlled',
            '--window-size=1280,720'
        ]
    });
    const page = await browser.newPage();
    
    // Mimic real browser headers
    await page.setExtraHTTPHeaders({
        'Accept-Language': 'en-US,en;q=0.9'
    });

    try {
        console.log("📡 Navigating to X (Direct)...");
        await page.goto('https://x.com/i/flow/login', { waitUntil: 'networkidle2' });
        await new Promise(r => setTimeout(r, 5000));

        // 1. Username
        console.log("👤 Typing Username...");
        await page.waitForSelector('input', { visible: true });
        await page.type('input', USERNAME, { delay: 150 });
        await page.keyboard.press('Enter');
        
        await new Promise(r => setTimeout(r, 5000));
        const bodyText = await page.evaluate(() => document.body.innerText);

        // 2. Email verification check
        if (bodyText.includes('Enter your phone number') || bodyText.includes('Verify your identity')) {
            console.log("🛡️ Email Verification Triggered. Injecting...");
            await page.type('input', EMAIL, { delay: 150 });
            await page.keyboard.press('Enter');
            await new Promise(r => setTimeout(r, 5000));
        }

        // 3. Password
        console.log("🔑 Checking for Password field...");
        await page.waitForSelector('input[name="password"]', { visible: true, timeout: 10000 });
        await page.type('input[name="password"]', PASSWORD, { delay: 150 });
        await page.keyboard.press('Enter');
        
        await new Promise(r => setTimeout(r, 10000));

        // 4. 2FA (TOTP)
        const currentText = await page.evaluate(() => document.body.innerText);
        if (currentText.includes('verification code')) {
            console.log("🔐 2FA Screen Detected. Generating Master Code...");
            const code = totp.generate(TOTP_SECRET);
            console.log(`🚀 Code Generated: ${code}`);
            await page.type('input', code, { delay: 150 });
            await page.keyboard.press('Enter');
            await new Promise(r => setTimeout(r, 10000));
        }

        // 5. Success Check
        const finalCheck = await page.evaluate(() => document.body.innerText.includes('Home'));
        if (finalCheck) {
            console.log("🏆 SHADOW BREACH SUCCESSFUL.");
            const cookies = await page.cookies();
            fs.writeFileSync(COOKIE_FILE, JSON.stringify(cookies, null, 2));
            await page.screenshot({ path: '/root/.openclaw/workspace/media/x_stealth_success.png' });
        } else {
            console.log("❌ Mission Failed. X is still resisting.");
            await page.screenshot({ path: '/root/.openclaw/workspace/media/x_stealth_failure.png' });
        }

    } catch (e) {
        console.error("❌ Error:", e.message);
        await page.screenshot({ path: '/root/.openclaw/workspace/media/x_stealth_error.png' });
    } finally {
        await browser.close();
        console.log("🚢 Protocol Terminated.");
    }
}

run();
