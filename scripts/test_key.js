const axios = require('axios');
require('dotenv').config({ path: '/root/.openclaw/workspace/.env' });
const API_KEY = process.env.MOLTX_API_KEY;
const BASE_URL = 'https://moltx.io/v1';

async function test() {
    try {
        console.log("Key:", API_KEY);
        const res = await axios.get(`${BASE_URL}/agents/me`, {
            headers: { 'Authorization': `Bearer ${API_KEY}` }
        });
        console.log("Me:", JSON.stringify(res.data));
    } catch (e) {
        console.error("Error:", e.response ? JSON.stringify(e.response.data) : e.message);
    }
}
test();
