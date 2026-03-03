
const { Connection, Keypair, Transaction, SystemProgram, LAMPORTS_PER_SOL, sendAndConfirmTransaction } = require('@solana/web3.js');
const bs58 = require('bs58');

async function payLaunchFee() {
    const connection = new Connection("https://api.mainnet-beta.solana.com", 'confirmed');
    const secretKey = bs58.decode('4w6BJoSZSN2Nhw4xXv9UJ8dF5oEcwDYM6PYSJ4Zcw2iaxHDWqi7KMweeeiabUkNPdRXkC5NTWM424hzRLrgoJi2u');
    const payer = Keypair.fromSecretKey(secretKey);
    const treasury = '49CfXAr58cCTGJnYsbm16fEsE5JRpdR8QQP8E1ZinGCq';

    console.log(`Payer Address: ${payer.publicKey.toBase58()}`);
    
    const balance = await connection.getBalance(payer.publicKey);
    console.log(`Balance: ${balance / LAMPORTS_PER_SOL} SOL`);

    if (balance < 0.031 * LAMPORTS_PER_SOL) {
        console.error("Insufficient balance for 0.03 SOL fee + gas");
        process.exit(1);
    }

    const transaction = new Transaction().add(
        SystemProgram.transfer({
            fromPubkey: payer.publicKey,
            toPubkey: treasury,
            lamports: 0.03 * LAMPORTS_PER_SOL,
        })
    );

    const signature = await sendAndConfirmTransaction(connection, transaction, [payer]);
    console.log(`SUCCESS: ${signature}`);
}

payLaunchFee().catch(err => {
    console.error(err);
    process.exit(1);
});
