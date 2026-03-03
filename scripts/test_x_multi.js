const axios = require('axios');
require('dotenv').config();

const BEARER = 'AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnvQ18sv9jJp6sk88YCD89A2v95k%3DTV9P7Bvep7h9U6O8T%2B61s0OML8X8fD94S6Y6V5P79D7';
const CT0 = 'c31fdba6fba4d80b1a09d1bbda811f10deee59bdb690dc73bf2f3dd31fb5642186a00ecb9cefdfae0b73f4744e5b8b6e6b4bf6860cf12dce481d5602a53ed48f5c02944ff668c154c19ca54d1a8544fb';

const identities = [
    'bcbf85bec9c9b8e550fca7f1c6dfe0ca3d6236fa', // Main
    'b26b581da602007907cae268ef036f92aeb976f0', // Multi 1
    '23e4a1bb68752a444a8bc9d797cdf83be7604573', // Multi 2
    '07527e98b6696f33c29461a73615c166ba21d8a5'  // Multi 3
];

async function testIdentities() {
    for (const token of identities) {
        console.log(`🔍 Testing Identity: ${token.substring(0, 10)}...`);
        try {
            const res = await axios.get('https://x.com/i/api/1.1/account/verify_credentials.json', {
                headers: {
                    'Cookie': `auth_token=${token}; ct0=${CT0}`,
                    'X-Csrf-Token': CT0,
                    'Authorization': `Bearer ${BEARER}`,
                    'User-Agent': 'Mozilla/5.0'
                }
            });
            console.log(`✅ SUCCESS! Found User: @${res.data.screen_name}`);
            return token;
        } catch (e) {
            console.log(`❌ Failed.`);
        }
    }
    console.log("🌑 No valid identities found in the vault.");
    return null;
}

testIdentities();
