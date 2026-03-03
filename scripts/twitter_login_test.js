const { Scraper } = require('agent-twitter-client');

async function login() {
  const scraper = new Scraper();
  const username = 'GojoSatoruamv';
  const password = 'Milekako122!!';
  const email = 'motivforyou992@gmail.com';

  console.log(`🚀 Attempting Twitter login for ${username}...`);
  try {
    await scraper.login(username, password, email);
    const isLoggedIn = await scraper.isLoggedIn();
    if (isLoggedIn) {
      console.log('✅ Successfully logged in!');
    } else {
      console.log('❌ Login failed without error.');
    }
  } catch (error) {
    if (error.message.includes('verification code') || error.message.includes('2FA')) {
      console.log('🔐 VERIFICATION CODE REQUIRED');
      console.log(error.message);
    } else {
      console.error('❌ Login error:', error.message);
    }
  }
}

login();
