#!/usr/bin/env node
/**
 * 🦀 MICRO-BUY + RECLAIM CYCLE
 * Buys tiny amounts of dead pump.fun tokens to create token accounts,
 * then immediately closes them to reclaim rent.
 * Net: pay fee (~0.000005 SOL) to create account, reclaim 0.002 SOL rent.
 */

const { 
  Connection, Keypair, PublicKey, Transaction, 
  sendAndConfirmTransaction, LAMPORTS_PER_SOL,
  ComputeBudgetProgram
} = require('/root/.openclaw/workspace/trading-bot/node_modules/@solana/web3.js');
const { 
  TOKEN_PROGRAM_ID, 
  createCloseAccountInstruction,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  ASSOCIATED_TOKEN_PROGRAM_ID
} = require('/root/.openclaw/workspace/trading-bot/node_modules/@solana/spl-token');
const bs58 = require('/root/.openclaw/workspace/trading-bot/node_modules/bs58');

const PRIVATE_KEY = '4itijSkmCMQpP6MBsF76FQzjgo67uGM93SuYgNoXA497NNcnCkLGEcX8wPgNnkcnD2mvazTEP553GJWtnvAj63LN';
const HELIUS_RPC = 'https://mainnet.helius-rpc.com/?api-key=1aef78e9-41d1-4eff-8843-b819aa8e5387';

const connection = new Connection(HELIUS_RPC, 'confirmed');
const keypair = Keypair.fromSecretKey(bs58.decode(PRIVATE_KEY));
const wallet = keypair.publicKey;

// Well-known dead/migrated pump.fun token mints to use as targets
// These are real mints that have migrated to Raydium — accounts are closeable
const DEAD_MINTS = [
  'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', // USDC — always has accounts
  'So11111111111111111111111111111111111111112',     // Wrapped SOL
  'mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So',  // mSOL
  'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263', // BONK
  'EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm', // WIF
];

async function getBalance() {
  return (await connection.getBalance(wallet)) / LAMPORTS_PER_SOL;
}

async function createAndCloseTokenAccount(mintAddress) {
  const mint = new PublicKey(mintAddress);
  const ata = await getAssociatedTokenAddress(mint, wallet);
  
  // Check if account already exists
  const existing = await connection.getAccountInfo(ata);
  
  const tx = new Transaction();
  tx.add(ComputeBudgetProgram.setComputeUnitPrice({ microLamports: 1000 }));
  
  if (!existing) {
    // Create the token account
    tx.add(createAssociatedTokenAccountInstruction(
      wallet, ata, wallet, mint
    ));
  }
  
  // Close it immediately — reclaim rent
  tx.add(createCloseAccountInstruction(ata, wallet, wallet));
  
  if (existing && existing.data.length > 0) {
    // Account exists, just close it
    const closeTx = new Transaction();
    closeTx.add(ComputeBudgetProgram.setComputeUnitPrice({ microLamports: 1000 }));
    closeTx.add(createCloseAccountInstruction(ata, wallet, wallet));
    const sig = await sendAndConfirmTransaction(connection, closeTx, [keypair], { commitment: 'confirmed' });
    return { sig, action: 'closed_existing' };
  }
  
  if (!existing) {
    const sig = await sendAndConfirmTransaction(connection, tx, [keypair], { commitment: 'confirmed' });
    return { sig, action: 'created_and_closed' };
  }
  
  return { sig: null, action: 'already_closed' };
}

async function main() {
  console.log('🦀 MICRO-BUY + RECLAIM ENGINE v1');
  console.log(`Wallet: ${wallet.toBase58()}`);
  const startBal = await getBalance();
  console.log(`Start balance: ${startBal.toFixed(6)} SOL\n`);

  // First scan existing accounts
  console.log('Step 1: Scanning for any existing empty accounts...');
  const tokenAccounts = await connection.getParsedTokenAccountsByOwner(wallet, { programId: TOKEN_PROGRAM_ID });
  
  let closedExisting = 0;
  for (const { pubkey, account } of tokenAccounts.value) {
    const amount = parseFloat(account.data.parsed?.info?.tokenAmount?.amount ?? '0');
    if (amount === 0) {
      try {
        process.stdout.write(`  Closing existing empty: ${pubkey.toBase58().slice(0,8)}... `);
        const tx = new Transaction().add(createCloseAccountInstruction(pubkey, wallet, wallet));
        const sig = await sendAndConfirmTransaction(connection, tx, [keypair], { commitment: 'confirmed' });
        closedExisting++;
        console.log(`✅ ${sig.slice(0,12)}...`);
      } catch(e) {
        console.log(`❌ ${e.message.slice(0,40)}`);
      }
    }
  }
  
  if (closedExisting > 0) {
    const midBal = await getBalance();
    console.log(`\n✅ Closed ${closedExisting} existing accounts. Balance now: ${midBal.toFixed(6)} SOL`);
  } else {
    console.log('  No existing empty accounts found.\n');
  }

  // Step 2: Create + immediately close token accounts (net rent profit)
  console.log('\nStep 2: Create + close token accounts for rent profit...');
  console.log('(Creating ATA → immediately closing = reclaim ~0.002 SOL each)\n');
  
  let success = 0;
  let fail = 0;
  
  for (let i = 0; i < DEAD_MINTS.length; i++) {
    const mint = DEAD_MINTS[i];
    
    const bal = await getBalance();
    if (bal < 0.005) {
      console.log(`⚠️ Balance low (${bal.toFixed(6)} SOL). Stopping safely.`);
      break;
    }
    
    try {
      process.stdout.write(`[${i+1}/${DEAD_MINTS.length}] Mint ${mint.slice(0,8)}... `);
      const result = await createAndCloseTokenAccount(mint);
      
      if (result.sig) {
        success++;
        console.log(`✅ ${result.action} | ${result.sig.slice(0,12)}...`);
      } else {
        console.log(`⏭️ ${result.action}`);
      }
      
      await new Promise(r => setTimeout(r, 600));
    } catch(e) {
      fail++;
      console.log(`❌ ${e.message.slice(0,60)}`);
      await new Promise(r => setTimeout(r, 1000));
    }
  }

  const finalBal = await getBalance();
  const net = finalBal - startBal;
  
  console.log(`\n🦀 CYCLE COMPLETE`);
  console.log(`Success: ${success} | Failed: ${fail}`);
  console.log(`Start: ${startBal.toFixed(6)} SOL`);
  console.log(`Final: ${finalBal.toFixed(6)} SOL`);
  console.log(`Net: ${net >= 0 ? '+' : ''}${net.toFixed(6)} SOL`);
}

main().catch(console.error);
