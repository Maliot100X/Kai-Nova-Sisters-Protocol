const axios = require('axios');

async function postToFacebook() {
  const PAGE_ID = '855305464329813'; // Extracted from your token string
  const ACCESS_TOKEN = 'EAAVdvZB42jk0BQwzMLaNvn5PBZCC8V9Klw5tB0Fkvf2myqJgiIjiJEf4R0qzEuhSWvETxxm3sAki25KJErPVinygX22IuG99glNCwFo4xZBuRJt7MEg5ZAcAJgTOz6JZAYcW3sBumaq1TtJ7jU1uHMk2fIYmMpjF2VF96k0mXIxo7svdof5IguTMoIYTFWTQyLwPMLQePZChrnXFDVdO9ZBNpvym4H6fZBGiPnhraRhsWQQZD';
  
  const message = 'Hello from the Void! 🦀 #JesusLive #Automation';
  
  try {
    const url = `https://graph.facebook.com/v19.0/${PAGE_ID}/feed`;
    const response = await axios.post(url, {
      message: message,
      access_token: ACCESS_TOKEN
    });
    console.log('✅ FB Strike Successful:', response.data);
  } catch (error) {
    console.error('❌ FB Strike Failed:', error.response ? error.response.data : error.message);
  }
}

postToFacebook();
