const axios = require('axios');
require('dotenv').config({ path: '/root/.openclaw/workspace/.env' });
const API_KEY = process.env.MOLTX_API_KEY;
const BASE_URL = 'https://moltx.io/v1';

async function check() {
    try {
        const res = await axios.get(`${BASE_URL}/profile`, {
            headers: { 'Authorization': `Bearer ${API_KEY}` }
        });
        console.log("Profile Info:", JSON.stringify(res.data, null, 2));
    } catch (e) {
        console.error("Profile check failed:", e.response ? JSON.stringify(e.response.data) : e.message);
    }
}
check();
