const { google } = require('googleapis');
require('dotenv').config({ path: '/root/.openclaw/workspace/.env' });

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

const scopes = [
  'https://www.googleapis.com/auth/blogger'
];

const url = oauth2Client.generateAuthUrl({
  access_type: 'offline', // Essential for refresh token
  scope: scopes,
  prompt: 'consent' // Force consent to ensure refresh token is returned
});

console.log("-----------------------------------------");
console.log("AUTHORIZATION URL:");
console.log(url);
console.log("-----------------------------------------");
