#!/usr/bin/env node
/**
 * 🦀 GLOBAL RENT RECLAIMER BOT v2
 * Scans ALL abandoned token accounts on Solana network-wide
 * and closes ones we are the authority on (i.e. our own wallet's accounts).
 * 
 * NOTE: We can only close accounts WHERE WE ARE THE OWNER/AUTHORITY.
 * We cannot close other people's accounts — that's theft.
 * But our wallet may have MANY dead token accounts from past activity.
 */

const { Connection, Keypair, PublicKey, Transaction, sendAndConfirmTransaction } = require('/root/.openclaw/workspace/trading-bot/node_modules/@solana/web3.js');
const { TOKEN_PROGRAM_ID, createCloseAccountInstruction } = require('/root/.openclaw/workspace/trading-bot/node_modules/@solana/spl-token');
const bs58 = require('/root/.openclaw/workspace/trading-bot/node_modules/bs58');

// CONFIG — Commander's wallet
const PRIVATE_KEY = '4itijSkmCMQpP6MBsF76FQzjgo67uGM93SuYgNoXA497NNcnCkLGEcX8wPgNnkcnD2mvazTEP553GJWtnvAj63LN';
const HELIUS_RPC = 'https://mainnet.helius-rpc.com/?api-key=1aef78e9-41d1-4eff-8843-b819aa8e5387';
const UPDATE_EVERY = 10;
const DELAY_MS = 500;

const connection = new Connection(HELIUS_RPC, 'confirmed');
const keypair = Keypair.fromSecretKey(bs58.decode(PRIVATE_KEY));
const wallet = keypair.publicKey;

async function getBalance() {
  const bal = await connection.getBalance(wallet);
  return bal / 1e9;
}

async function findAllEmptyAccounts() {
  console.log('🔍 Scanning ALL token accounts owned by our wallet via Helius...');
  
  // Get ALL token accounts (including zero balance) using Helius
  const response = await fetch(`${HELIUS_RPC}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'getProgramAccounts',
      params: [
        TOKEN_PROGRAM_ID.toBase58(),
        {
          encoding: 'jsonParsed',
          filters: [
            { dataSize: 165 }, // standard token account size
            {
              memcmp: {
                offset: 32, // owner field offset
                bytes: wallet.toBase58()
              }
            }
          ]
        }
      ]
    })
  });

  const data = await response.json();
  
  if (data.error) {
    throw new Error(`RPC Error: ${data.error.message}`);
  }

  const allAccounts = data.result || [];
  console.log(`Found ${allAccounts.length} total token accounts owned by our wallet`);

  const empty = [];
  for (const acct of allAccounts) {
    const amount = acct.account?.data?.parsed?.info?.tokenAmount?.uiAmount ?? 0;
    const decimals = acct.account?.data?.parsed?.info?.tokenAmount?.decimals ?? 0;
    const rawAmount = acct.account?.data?.parsed?.info?.tokenAmount?.amount ?? '0';
    
    if (parseFloat(rawAmount) === 0) {
      empty.push(new PublicKey(acct.pubkey));
    }
  }

  return empty;
}

async function closeAccount(tokenAccountPubkey) {
  const tx = new Transaction().add(
    createCloseAccountInstruction(
      tokenAccountPubkey,
      wallet,
      wallet,
    )
  );

  const sig = await sendAndConfirmTransaction(connection, tx, [keypair], {
    commitment: 'confirmed',
    maxRetries: 3
  });
  return sig;
}

async function main() {
  console.log('🦀 GLOBAL RENT RECLAIMER BOT v2 ONLINE');
  console.log(`Wallet: ${wallet.toBase58()}`);
  const startBalance = await getBalance();
  console.log(`Starting balance: ${startBalance.toFixed(6)} SOL\n`);

  let emptyAccounts;
  try {
    emptyAccounts = await findAllEmptyAccounts();
  } catch (err) {
    console.error('❌ Scan failed:', err.message);
    process.exit(1);
  }

  console.log(`\n🎯 Empty accounts to close: ${emptyAccounts.length}`);

  if (emptyAccounts.length === 0) {
    console.log('✅ No empty accounts. Wallet is clean.');
    console.log(`Balance: ${startBalance.toFixed(6)} SOL — untouched.`);
    process.exit(0);
  }

  let totalClosed = 0;
  let failed = 0;

  for (let i = 0; i < emptyAccounts.length; i++) {
    const acct = emptyAccounts[i];
    
    // Safety check — don't burn all gas
    const currentBal = await getBalance();
    if (currentBal < 0.001) {
      console.log(`⚠️ Balance too low (${currentBal.toFixed(6)} SOL). Stopping to preserve gas.`);
      break;
    }

    try {
      process.stdout.write(`[${i+1}/${emptyAccounts.length}] Closing ${acct.toBase58().slice(0,8)}... `);
      const sig = await closeAccount(acct);
      totalClosed++;
      console.log(`✅ ${sig.slice(0,12)}...`);

      if (totalClosed % UPDATE_EVERY === 0) {
        const bal = await getBalance();
        const gained = bal - startBalance;
        console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
        console.log(`📊 ${totalClosed} closed | Balance: ${bal.toFixed(6)} SOL | +${gained.toFixed(6)} SOL gained`);
        console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
      }

      await new Promise(r => setTimeout(r, DELAY_MS));
    } catch (err) {
      failed++;
      console.log(`❌ ${err.message.slice(0, 50)}`);
    }
  }

  const finalBal = await getBalance();
  const net = finalBal - startBalance;
  console.log(`\n🦀 DONE`);
  console.log(`Closed: ${totalClosed} | Failed: ${failed}`);
  console.log(`Start: ${startBalance.toFixed(6)} SOL → Final: ${finalBal.toFixed(6)} SOL`);
  console.log(`Net: ${net >= 0 ? '+' : ''}${net.toFixed(6)} SOL`);
}

main().catch(console.error);
