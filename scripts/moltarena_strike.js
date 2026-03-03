const axios = require('axios');
const fs = require('fs');

const AGENT_ID = '195abd22-a369-4e4a-8141-b9b831c97548';

async function run() {
  let key;
  let url = 'https://moltarena.crosstoken.io/api';
  
  try {
    const env = fs.readFileSync('/root/.openclaw/workspace/.env.moltarena', 'utf8');
    const lines = env.split('\n');
    for (const line of lines) {
      if (line.startsWith('MOLT_ARENA_API_KEY=')) {
        key = line.split('=')[1].trim();
      }
      if (line.startsWith('MOLT_ARENA_API_URL=')) {
        url = line.split('=')[1].trim();
      }
    }
  } catch (e) {
    console.error('Env read failed:', e.message);
  }

  if (!key) {
    process.stdout.write("NO_REPLY");
    process.exit(0);
  }

  const isGroup = Math.random() < 0.2; 
  const type = isGroup ? 'group' : 'solo'; 
  
  const payload = {
    agentId: AGENT_ID,
    strategy: 'similar_rating',
    autoStart: true,
    battleType: type
  };

  try {
    const res = await axios.post(`${url}/battles`, payload, {
      headers: {
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json'
      }
    });

    console.log(`✅ MoltArena Strike [${type.toUpperCase()}] Successful for ${AGENT_ID}`);
    console.log(`Battle ID: ${res.data.id || res.data.battleId || 'pending'}`);

    const logEntry = `${new Date().toISOString()} | ${type.toUpperCase()} | SUCCESS | ID: ${res.data.id || 'N/A'}\n`;
    fs.appendFileSync('/root/.openclaw/workspace/moltarena_strike_log.txt', logEntry);

  } catch (error) {
    const status = error.response?.status;
    if (status === 429 || status === 401 || status === 403) {
      // Re-throw or special handling for rate limits as per instructions
      console.error(`Status Code: ${status}`);
      console.error(`Response Data: ${JSON.stringify(error.response?.data)}`);
      process.stdout.write("NO_REPLY");
    } else {
      // For any other error, log it. If battleType 'solo' failed, try 'direct' just in case.
      if (type === 'solo') {
          payload.battleType = 'direct';
          try {
              const res2 = await axios.post(`${url}/battles`, payload, {
                headers: {
                  'Authorization': `Bearer ${key}`,
                  'Content-Type': 'application/json'
                }
              });
              console.log(`✅ MoltArena Strike [DIRECT] Successful for ${AGENT_ID}`);
              const logEntry = `${new Date().toISOString()} | DIRECT | SUCCESS | ID: ${res2.data.id || 'N/A'}\n`;
              fs.appendFileSync('/root/.openclaw/workspace/moltarena_strike_log.txt', logEntry);
              return;
          } catch (e2) {}
      }

      console.error(`Status Code: ${status}`);
      console.error(`Response Data: ${JSON.stringify(error.response?.data)}`);
      console.error(`❌ Strike Error: ${status || 'Unknown'} ${error.message}`);
      
      const logEntry = `${new Date().toISOString()} | ${type.toUpperCase()} | ERROR: ${status} | ${error.message}\n`;
      fs.appendFileSync('/root/.openclaw/workspace/moltarena_strike_log.txt', logEntry);
    }
  }
}

run();
