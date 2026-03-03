#!/usr/bin/env node
/**
 * 🦀 MOLTARENA BATTLE STRIKE ENGINE v2
 * 10 solo battles (1 per hour for 10 hours)
 * Then mix group battles in next 10 hours
 * 10 min cooldown enforced
 */

const axios = require('/root/.openclaw/workspace/trading-bot/node_modules/axios');
const fs = require('fs');

const AGENT_ID = '195abd22-a369-4e4a-8141-b9b831c97548';
const API_URL = 'https://moltarena.crosstoken.io/api';
const API_KEY = 'pk_live_FLhD2q2e_HfDV1iAQKiaCQFWU1Uh5kgk';
const LOG_FILE = '/root/.openclaw/workspace/memory/moltarena_strike_log.txt';
const STATE_FILE = '/root/.openclaw/workspace/memory/moltarena_state.json';

function loadState() {
  try {
    return JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
  } catch {
    return { battlesToday: 0, lastBattleTime: 0, soloCount: 0, groupCount: 0, date: '' };
  }
}

function saveState(state) {
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

function log(msg) {
  const entry = `${new Date().toISOString()} | ${msg}\n`;
  fs.appendFileSync(LOG_FILE, entry);
  console.log(msg);
}

async function fireBattle(type) {
  const payload = {
    agentId: AGENT_ID,
    strategy: 'similar_rating',
    autoStart: true,
    battleType: type
  };

  const res = await axios.post(`${API_URL}/battles`, payload, {
    headers: {
      'x-api-key': API_KEY,
      'Content-Type': 'application/json'
    },
    timeout: 15000
  });

  return res.data;
}

async function main() {
  const state = loadState();
  const now = Date.now();
  const today = new Date().toISOString().slice(0, 10);

  // Reset daily counter
  if (state.date !== today) {
    state.battlesToday = 0;
    state.soloCount = 0;
    state.groupCount = 0;
    state.date = today;
  }

  // Enforce 30 min cooldown per Commander's order
  const cooldownMs = 30 * 60 * 1000;
  const elapsed = now - (state.lastBattleTime || 0);
  if (elapsed < cooldownMs) {
    const waitMin = Math.ceil((cooldownMs - elapsed) / 60000);
    console.log(`⏳ 30min Cooldown active. ${waitMin}min remaining. Skipping.`);
    return;
  }

  // Strategy: 10 solo battles over 10 hours (one per hour/30m), then 3 groups
  let type;
  if (state.soloCount < 10) {
      type = 'solo';
  } else if (state.groupCount < 3) {
      type = 'group';
  } else {
      console.log(`✅ Daily targets met (Solo: 10, Group: 3).`);
      return;
  }

  try {
    log(`⚔️ Firing ${type.toUpperCase()} battle (Strike #${(type === 'solo' ? state.soloCount : state.groupCount) + 1})...`);
    const result = await fireBattle(type);
    const battleId = result.id || result.battleId || 'unknown';
    
    state.battlesToday++;
    state.lastBattleTime = now;
    if (type === 'solo') state.soloCount++;
    else state.groupCount++;
    saveState(state);

    log(`✅ ${type.toUpperCase()} fired | ID: ${battleId} | Progress: Solo ${state.soloCount}/10, Group ${state.groupCount}/3`);
  } catch (err) {
    const status = err.response?.status;
    const msg = err.response?.data?.error || err.response?.data?.message || err.message;
    
    // Failover to Bearer if x-api-key fails with 401
    if (status === 401) {
        log(`⚠️ ${type.toUpperCase()} failed [401]. Retrying with Bearer Auth...`);
        try {
            const res2 = await axios.post(`${API_URL}/battles`, {
                agentId: AGENT_ID,
                strategy: 'similar_rating',
                autoStart: true,
                battleType: type
            }, {
                headers: {
                  'Authorization': `Bearer ${API_KEY}`,
                  'Content-Type': 'application/json'
                }
            });
            const result2 = res2.data;
            state.battlesToday++;
            state.lastBattleTime = now;
            if (type === 'solo') state.soloCount++;
            else state.groupCount++;
            saveState(state);
            log(`✅ ${type.toUpperCase()} fired (Bearer Retry) | ID: ${result2.id || 'unknown'}`);
        } catch (err2) {
            log(`❌ Final Strike Failure [${err2.response?.status}]: ${err2.response?.data?.error || err2.message}`);
        }
    } else {
        log(`❌ ${type.toUpperCase()} failed [${status}]: ${msg}`);
    }
  }
}

main().catch(e => log(`FATAL: ${e.message}`));
