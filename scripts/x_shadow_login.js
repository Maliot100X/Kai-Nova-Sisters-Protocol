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
    console.log("🏗️ Initializing Aggressive Breach Protocol...");
    const browser = await puppeteer.launch({
        headless: "new",
        executablePath: "/usr/bin/google-chrome-stable",
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720 });

    try {
        await page.goto('https://x.com/i/flow/login', { waitUntil: 'networkidle2' });
        
        // 1. Enter Username
        console.log("👤 Entering Username...");
        await page.waitForSelector('input[autocomplete="username"]');
        await page.type('input[autocomplete="username"]', USERNAME, { delay: 100 });
        
        // Try both Enter and manual button click
        console.log("🖱️ Clicking Next...");
        const buttons = await page.$$('button');
        for (const btn of buttons) {
            const text = await page.evaluate(el => el.innerText, btn);
            if (text === 'Next') {
                await btn.click();
                break;
            }
        }

        await new Promise(r => setTimeout(r, 5000));

        // 2. Check for Verification (Email)
        const checkVerification = await page.evaluate(() => {
            return document.body.innerText.includes('Verify your identity') || 
                   document.body.innerText.includes('Enter your phone number or email address');
        });

        if (checkVerification) {
            console.log("🛡️ Verification Detected. Injecting Email...");
            await page.waitForSelector('input');
            await page.type('input', EMAIL, { delay: 100 });
            // Click Next button again
            const buttons2 = await page.$$('button');
            for (const btn of buttons2) {
                const text = await page.evaluate(el => el.innerText, btn);
                if (text === 'Next') {
                    await btn.click();
                    break;
                }
            }
            await new Promise(r => setTimeout(r, 5000));
        }

        // 3. Enter Password
        console.log("🔑 Entering Password...");
        await page.waitForSelector('input[name="password"]');
        await page.type('input[name="password"]', PASSWORD, { delay: 100 });
        
        // Click Log in
        const buttons3 = await page.$$('button');
        for (const btn of buttons3) {
            const text = await page.evaluate(el => el.innerText, btn);
            if (text === 'Log in') {
                await btn.click();
                break;
            }
        }
        
        await new Promise(r => setTimeout(r, 5000));

        // 4. Handle 2FA
        const check2FA = await page.evaluate(() => {
            return document.body.innerText.includes('Enter your verification code') || 
                   document.body.innerText.includes('Check your Google Authenticator app');
        });

        if (check2FA) {
            console.log("🔐 2FA Triggered. Generating Code...");
            const code = totp.generate(TOTP_SECRET);
            console.log(`🚀 Generated: ${code}`);
            await page.waitForSelector('input[data-testid="ocfEnterTextTextInput"]');
            await page.type('input[data-testid="ocfEnterTextTextInput"]', code, { delay: 100 });
            await page.keyboard.press('Enter');
            await new Promise(r => setTimeout(r, 10000));
        }

        // 5. Final Verification
        const finalCheck = await page.evaluate(() => document.body.innerText.includes('Home'));
        if (finalCheck) {
            console.log("🏆 BREACH SUCCESSFUL. Fortress Secured.");
            const cookies = await page.cookies();
            fs.writeFileSync(COOKIE_FILE, JSON.stringify(cookies, null, 2));
            await page.screenshot({ path: '/root/.openclaw/workspace/media/x_final_success.png' });
        } else {
            console.log("❌ Final check failed.");
            await page.screenshot({ path: '/root/.openclaw/workspace/media/x_final_status.png' });
        }

    } catch (e) {
        console.error("❌ Error:", e.message);
        await page.screenshot({ path: '/root/.openclaw/workspace/media/x_fatal_error.png' });
    } finally {
        await browser.close();
        console.log("🚢 Protocol Ended.");
    }
}

run();
