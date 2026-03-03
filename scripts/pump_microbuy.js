#!/usr/bin/env node
/**
 * 🦀 PUMP.FUN MICRO-BUY BOT
 * Buys tiny amounts of dead pump.fun tokens to create token accounts.
 * Then rent reclaimer closes them for profit.
 */

const { Connection, Keypair, VersionedTransaction } = require('/root/.openclaw/workspace/trading-bot/node_modules/@solana/web3.js');
const bs58 = require('/root/.openclaw/workspace/trading-bot/node_modules/bs58');

const PRIVATE_KEY = '4itijSkmCMQpP6MBsF76FQzjgo67uGM93SuYgNoXA497NNcnCkLGEcX8wPgNnkcnD2mvazTEP553GJWtnvAj63LN';
const HELIUS_RPC = 'https://mainnet.helius-rpc.com/?api-key=1aef78e9-41d1-4eff-8843-b819aa8e5387';

const connection = new Connection(HELIUS_RPC, 'confirmed');
const keypair = Keypair.fromSecretKey(bs58.decode(PRIVATE_KEY));
const wallet = keypair.publicKey;

// Dead pump.fun tokens (very low volume, still on bonding curve)
const TARGETS = [
  '8FtafPHhmYVtKQYrbNs4ZSS2Hwykw5dJ3t1JtGsC5yBx',
  '6Jc7JsWnjLMvpwJ1yaRacH75v91LnAjhpLkJ8FdQ35i7',
  'Eg8uZs9Rv1TM7zZSkpeEX8oGoG8MM6UeJVid3S3KSWJq',
];

const BUY_AMOUNT_SOL = 0.002; // bare minimum buy

async function getBalance() {
  return (await connection.getBalance(wallet)) / 1e9;
}

async function buyToken(mint) {
  const response = await fetch('https://pumpportal.fun/api/trade-local', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      publicKey: wallet.toBase58(),
      action: 'buy',
      mint: mint,
      denominatedInSol: 'true',
      amount: BUY_AMOUNT_SOL,
      slippage: 50,
      priorityFee: 0.00001,
      pool: 'pump'
    })
  });

  if (!response.ok) {
    const txt = await response.text();
    throw new Error(`PumpPortal error: ${response.status} ${txt.slice(0,80)}`);
  }

  const data = await response.arrayBuffer();
  const tx = VersionedTransaction.deserialize(new Uint8Array(data));
  tx.sign([keypair]);

  const sig = await connection.sendTransaction(tx, { maxRetries: 3 });
  await connection.confirmTransaction(sig, 'confirmed');
  return sig;
}

async function main() {
  console.log('🦀 PUMP.FUN MICRO-BUY BOT');
  console.log(`Wallet: ${wallet.toBase58()}`);
  const startBal = await getBalance();
  console.log(`Balance: ${startBal.toFixed(6)} SOL\n`);

  let bought = 0;
  for (let i = 0; i < TARGETS.length; i++) {
    const mint = TARGETS[i];
    const bal = await getBalance();
    if (bal < 0.01) {
      console.log(`⚠️ Balance too low (${bal.toFixed(6)}). Stopping.`);
      break;
    }

    try {
      process.stdout.write(`[${i+1}/${TARGETS.length}] Buying ${mint.slice(0,8)}... `);
      const sig = await buyToken(mint);
      bought++;
      console.log(`✅ ${sig.slice(0,12)}...`);
      await new Promise(r => setTimeout(r, 1500));
    } catch(e) {
      console.log(`❌ ${e.message.slice(0,80)}`);
    }
  }

  const finalBal = await getBalance();
  console.log(`\n✅ Bought ${bought} tokens`);
  console.log(`Balance: ${finalBal.toFixed(6)} SOL`);
  console.log(`Spent: ${(startBal - finalBal).toFixed(6)} SOL`);
  console.log(`\n🔄 Now run rent_reclaimer_global.js to close these accounts and reclaim rent`);
}

main().catch(console.error);
