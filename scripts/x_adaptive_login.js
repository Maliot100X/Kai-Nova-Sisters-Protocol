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
    console.log("🕵️ Starting Adaptive Breach...");
    const browser = await puppeteer.launch({
        headless: "new",
        executablePath: "/usr/bin/google-chrome-stable",
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720 });

    try {
        await page.goto('https://x.com/i/flow/login', { waitUntil: 'networkidle2' });
        
        // Step 1: Username
        console.log("👤 Typing Username...");
        await page.waitForSelector('input');
        await page.type('input', USERNAME);
        const buttons = await page.$$('button');
        for (const btn of buttons) {
            const text = await page.evaluate(el => el.innerText, btn);
            if (text === 'Next') { await btn.click(); break; }
        }

        await new Promise(r => setTimeout(r, 8000));
        await page.screenshot({ path: '/root/.openclaw/workspace/media/x_adaptive_1.png' });

        // Check if on password or verification screen
        const text = await page.evaluate(() => document.body.innerText);
        console.log("📄 STATUS: " + text.substring(0, 100));

        if (text.includes('Enter your phone number or email') || text.includes('Verify your identity')) {
            console.log("🛡️ Verification Detected. Injecting Email...");
            await page.type('input', EMAIL);
            const nextBtns = await page.$$('button');
            for (const btn of nextBtns) {
                const bText = await page.evaluate(el => el.innerText, btn);
                if (bText === 'Next') { await btn.click(); break; }
            }
            await new Promise(r => setTimeout(r, 8000));
            await page.screenshot({ path: '/root/.openclaw/workspace/media/x_adaptive_2.png' });
        }

        // Now try Password
        console.log("🔑 Checking for Password field...");
        const passInputs = await page.$$('input[name="password"]');
        if (passInputs.length > 0) {
            await page.type('input[name="password"]', PASSWORD);
            const logBtns = await page.$$('button');
            for (const btn of logBtns) {
                const bText = await page.evaluate(el => el.innerText, btn);
                if (bText === 'Log in') { await btn.click(); break; }
            }
            await new Promise(r => setTimeout(r, 8000));
        }

        // Final 2FA
        const finalCheck = await page.evaluate(() => document.body.innerText.includes('verification code'));
        if (finalCheck) {
            console.log("🔐 2FA Screen Detected.");
            const code = totp.generate(TOTP_SECRET);
            console.log("🚀 Code: " + code);
            await page.type('input', code);
            await page.keyboard.press('Enter');
            await new Promise(r => setTimeout(r, 10000));
        }

        await page.screenshot({ path: '/root/.openclaw/workspace/media/x_adaptive_final.png' });

    } catch (e) {
        console.error("❌ Error:", e.message);
    } finally {
        await browser.close();
        console.log("🚢 Mission End.");
    }
}

run();
