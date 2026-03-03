const { google } = require('googleapis');
require('dotenv').config({ path: '/root/.openclaw/workspace/.env' });
const fs = require('fs');

const code = '4/0AfrIepDRSZ5X7erBmeApqUKUslZirtzllaUrql4JY8SXDPyG_Dwm-glwL_UfEI4FZvvLHg';

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

async function exchange() {
  try {
    console.log("Exchanging code for tokens...");
    const { tokens } = await oauth2Client.getToken(code);
    console.log("Tokens received!");
    
    if (tokens.refresh_token) {
      console.log("REFRESH TOKEN FOUND:", tokens.refresh_token);
      
      const creds = JSON.parse(fs.readFileSync('/root/.openclaw/workspace/system/google_creds.json', 'utf8'));
      creds.refresh_token = tokens.refresh_token;
      fs.writeFileSync('/root/.openclaw/workspace/system/google_creds.json', JSON.stringify(creds, null, 2));
      
      console.log("Vault updated successfully.");
    } else {
      console.log("No refresh token returned. (Was it already granted?)");
    }
  } catch (e) {
    console.error("Exchange Error:", e.message);
  }
}

exchange();
