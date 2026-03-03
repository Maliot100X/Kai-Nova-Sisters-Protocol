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
    console.log("🕵️ Launching Final Breach Attempt...");
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

        // 1. Username
        console.log("👤 Entering Username...");
        await page.waitForSelector('input');
        await page.type('input', USERNAME, { delay: 100 });
        await page.keyboard.press('Enter');
        await new Promise(r => setTimeout(r, 5000));

        // 2. Identify current screen
        const text = await page.evaluate(() => document.body.innerText);
        console.log("📄 Page Status: " + text.substring(0, 150).replace(/\n/g, ' '));

        if (text.includes('Verify your identity') || text.includes('Enter your phone number')) {
            console.log("🛡️ Verification Detected. Injecting Email...");
            await page.type('input', EMAIL, { delay: 100 });
            await page.keyboard.press('Enter');
            await new Promise(r => setTimeout(r, 5000));
        }

        // 3. Password
        console.log("🔑 Checking for Password field...");
        const passwordInput = await page.$('input[name="password"]');
        if (passwordInput) {
            await passwordInput.type(PASSWORD, { delay: 100 });
            await page.keyboard.press('Enter');
            await new Promise(r => setTimeout(r, 5000));
        } else {
            console.log("⚠️ Password field missing. Attempting generic input...");
            await page.type('input', PASSWORD, { delay: 100 });
            await page.keyboard.press('Enter');
            await new Promise(r => setTimeout(r, 5000));
        }

        // 4. 2FA Check
        const finalStatus = await page.evaluate(() => document.body.innerText);
        if (finalStatus.includes('verification code')) {
            console.log("🔐 2FA Required. Generating TOTP...");
            const code = totp.generate(TOTP_SECRET);
            console.log("🚀 Code: " + code);
            await page.type('input', code, { delay: 100 });
            await page.keyboard.press('Enter');
            await new Promise(r => setTimeout(r, 10000));
        }

        const homeCheck = await page.evaluate(() => document.body.innerText.includes('Home'));
        if (homeCheck) {
            console.log("🏆 SUCCESS.");
            const cookies = await page.cookies();
            fs.writeFileSync('/root/.openclaw/workspace/memory/x_session.json', JSON.stringify(cookies, null, 2));
            await page.screenshot({ path: '/root/.openclaw/workspace/media/x_final_glory.png' });
        } else {
            console.log("❌ Failed.");
            await page.screenshot({ path: '/root/.openclaw/workspace/media/x_final_defeat.png' });
        }

    } catch (e) {
        console.error("❌ Fatal:", e.message);
    } finally {
        await browser.close();
    }
}

run();
