const { createPublicClient, http } = require('viem');
const { bsc } = require('viem/chains');
const axios = require('axios');

const API_BASE = 'https://api.four.meme/api/v1'; // Probable base URL

async function scout() {
  console.log('--- 🦀 Four.Meme Agentic Scout Initializing ---');
  
  const client = createPublicClient({
    chain: bsc,
    transport: http()
  });

  try {
    const blockNumber = await client.getBlockNumber();
    console.log(`✅ BNB Chain Connection: Block ${blockNumber}`);
  } catch (e) {
    console.error(`❌ BNB Chain Error: ${e.message}`);
  }

  // Attempting to discover API endpoints
  const endpoints = [
    '/tokens',
    '/agents',
    '/launch',
    '/agentic/status',
    '/docs',
    '/config'
  ];

  for (const endpoint of endpoints) {
    try {
      const res = await axios.get(`${API_BASE}${endpoint}`);
      console.log(`🔍 [${endpoint}] Found: Status ${res.status}`);
      // console.log(res.data);
    } catch (e) {
      console.log(`❌ [${endpoint}] Not found or error: ${e.message}`);
    }
  }
}

scout();
