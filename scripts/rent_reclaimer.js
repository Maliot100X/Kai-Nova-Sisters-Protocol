#!/usr/bin/env node
/**
 * 🦀 RENT RECLAIMER BOT
 * Finds abandoned token accounts and closes them to reclaim SOL rent.
 * Commander's wallet: H3p5VkKyesUsKqNfLX6CA598qEhHe1NQaHa5rZNiSkwL
 */

const { Connection, Keypair, PublicKey, Transaction, sendAndConfirmTransaction } = require('/root/.openclaw/workspace/trading-bot/node_modules/@solana/web3.js');
const { TOKEN_PROGRAM_ID, createCloseAccountInstruction } = require('/root/.openclaw/workspace/trading-bot/node_modules/@solana/spl-token');
const bs58 = require('/root/.openclaw/workspace/trading-bot/node_modules/bs58');

// CONFIG
const PRIVATE_KEY = '4itijSkmCMQpP6MBsF76FQzjgo67uGM93SuYgNoXA497NNcnCkLGEcX8wPgNnkcnD2mvazTEP553GJWtnvAj63LN';
const RPC = 'https://api.mainnet-beta.solana.com';
const UPDATE_EVERY = 10; // notify every N closures
const DELAY_MS = 800; // delay between txs to avoid rate limits

const connection = new Connection(RPC, 'confirmed');
const keypair = Keypair.fromSecretKey(bs58.decode(PRIVATE_KEY));
const wallet = keypair.publicKey;

let totalClosed = 0;
let totalReclaimed = 0;
let startBalance = 0;

async function getBalance() {
  const bal = await connection.getBalance(wallet);
  return bal / 1e9;
}

async function findEmptyTokenAccounts() {
  const accounts = await connection.getParsedTokenAccountsByOwner(wallet, {
    programId: TOKEN_PROGRAM_ID
  });

  const empty = [];
  for (const { pubkey, account } of accounts.value) {
    const amount = account.data.parsed?.info?.tokenAmount?.uiAmount ?? 0;
    if (amount === 0) {
      empty.push(pubkey);
    }
  }
  return empty;
}

async function closeAccount(tokenAccountPubkey) {
  const tx = new Transaction().add(
    createCloseAccountInstruction(
      tokenAccountPubkey,
      wallet, // destination (receive rent back)
      wallet, // authority
    )
  );

  const sig = await sendAndConfirmTransaction(connection, tx, [keypair], {
    commitment: 'confirmed',
    maxRetries: 3
  });
  return sig;
}

async function main() {
  console.log('🦀 RENT RECLAIMER BOT ONLINE');
  console.log(`Wallet: ${wallet.toBase58()}`);
  startBalance = await getBalance();
  console.log(`Starting balance: ${startBalance.toFixed(6)} SOL\n`);

  // Find all empty token accounts owned by our wallet
  console.log('🔍 Scanning for empty token accounts...');
  const emptyAccounts = await findEmptyTokenAccounts();
  console.log(`Found ${emptyAccounts.length} empty accounts to close.\n`);

  if (emptyAccounts.length === 0) {
    console.log('✅ No empty accounts found. Grid is clean.');
    console.log('💡 This bot is most useful after buying many tokens.');
    console.log('   Run again after more token interactions.');
    process.exit(0);
  }

  for (let i = 0; i < emptyAccounts.length; i++) {
    const acct = emptyAccounts[i];
    try {
      process.stdout.write(`[${i+1}/${emptyAccounts.length}] Closing ${acct.toBase58().slice(0,8)}... `);
      const sig = await closeAccount(acct);
      totalClosed++;
      console.log(`✅ sig: ${sig.slice(0,12)}...`);

      // Update every N closures
      if (totalClosed % UPDATE_EVERY === 0) {
        const currentBal = await getBalance();
        const reclaimed = currentBal - startBalance;
        console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
        console.log(`📊 UPDATE: ${totalClosed} accounts closed`);
        console.log(`💰 Current balance: ${currentBal.toFixed(6)} SOL`);
        console.log(`📈 Reclaimed so far: +${reclaimed.toFixed(6)} SOL`);
        console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
      }

      await new Promise(r => setTimeout(r, DELAY_MS));
    } catch (err) {
      console.log(`❌ Failed: ${err.message.slice(0, 60)}`);
    }
  }

  const finalBal = await getBalance();
  const totalReclaimed = finalBal - startBalance;
  console.log(`\n🦀 MISSION COMPLETE`);
  console.log(`Closed: ${totalClosed} accounts`);
  console.log(`Start: ${startBalance.toFixed(6)} SOL`);
  console.log(`Final: ${finalBal.toFixed(6)} SOL`);
  console.log(`Net: +${totalReclaimed.toFixed(6)} SOL reclaimed`);
}

main().catch(console.error);
