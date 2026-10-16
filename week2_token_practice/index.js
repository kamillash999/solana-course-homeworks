const {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  Transaction,
  TransactionInstruction,
  sendAndConfirmTransaction,
  clusterApiUrl,
} = require("@solana/web3.js");

const {
  createMint,
  getOrCreateAssociatedTokenAccount,
  mintTo,
  burn,
  transfer,
} = require("@solana/spl-token");

// Адрес официальной программы Memo в Solana
const MEMO_PROGRAM_ID = new PublicKey(
  "MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"
);

async function main() {
  // 1. Подключение к Devnet
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

  // 2. Генерация кошельков (Создатель токена и 3 получателя/однокурсника)
  const payer = Keypair.generate();
  const receiver1 = Keypair.generate();
  const receiver2 = Keypair.generate();
  const receiver3 = Keypair.generate();

  console.log("=== Неделя 2: SPL Token Practice ===");
  console.log("Адрес создателя токена (Payer):", payer.publicKey.toBase58());

  // 3. Запрос Airdrop 2 SOL для оплаты комиссий
  console.log("\n1. Запрашиваем Airdrop (2 SOL)...");
  try {
    const airdropSig = await connection.requestAirdrop(
      payer.publicKey,
      2 * LAMPORTS_PER_SOL
    );
    const latestBlock = await connection.getLatestBlockhash();
    await connection.confirmTransaction({
      blockhash: latestBlock.blockhash,
      lastValidBlockHeight: latestBlock.lastValidBlockHeight,
      signature: airdropSig,
    });
    console.log("Airdrop успешно получен!");
  } catch (err) {
    console.log("⚠️ Запросите SOL вручную через https://solfaucet.com/ на адрес payer:", payer.publicKey.toBase58());
    return;
  }

  // 4. Создание токена (Mint Account)
  console.log("\n2. Создаем SPL Token Mint...");
  const decimals = 9; // 9 знаков после запятой (стандарт)
  const mint = await createMint(
    connection,
    payer,             // Платтельщик комиссии
    payer.publicKey,   // Адрес, имеющий право выпускать токены (Mint Authority)
    payer.publicKey,   // Адрес, имеющий право замораживать токены (Freeze Authority)
    decimals
  );
  console.log("Токен Mint создан! Адрес токена:", mint.toBase58());

  // 5. Создание Associated Token Account (ATA) для отправителя
  console.log("\n3. Создаем Токен-Аккаунт (ATA) для отправителя...");
  const payerTokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    payer,
    mint,
    payer.publicKey
  );
  console.log("ATA отправителя:", payerTokenAccount.address.toBase58());

  // 6. Чеканка (MintTo) 9950 токенов
  console.log("\n4. Чеканим (MintTo) 9950 токенов...");
  const initialAmount = 9950 * Math.pow(10, decimals); // с учетом decimals
  await mintTo(
    connection,
    payer,
    mint,
    payerTokenAccount.address,
    payer,
    initialAmount
  );
  console.log("Успешно зачеканено 9950 токенов!");

  // 7. Сжигание (Burn) 100 токенов
  console.log("\n5. Сжигаем (Burn) 100 токенов...");
  const burnAmount = 100 * Math.pow(10, decimals);
  await burn(
    connection,
    payer,
    payerTokenAccount.address,
    mint,
    payer,
    burnAmount
  );
  console.log("Успешно сожжено 100 токенов!");

  // 8. Создание ATA и Перевод токенов трем получателям с Memo
  const receivers = [receiver1, receiver2, receiver3];
  
  for (let i = 0; i < receivers.length; i++) {
    const receiver = receivers[i];
    console.log(`\n6.${i + 1} Перевод 100 токенов получателю #${i + 1}...`);

    // Создаем ATA для получателя
    const receiverTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      payer,
      mint,
      receiver.publicKey
    );

    // Создаем транзакцию с инструкцией перевода + Memo
    const transferTx = new Transaction();

    // Добавляем перевод SPL-токена (100 токенов)
    const transferAmount = 100 * Math.pow(10, decimals);
    
    // Переводим токены
    await transfer(
      connection,
      payer,
      payerTokenAccount.address,
      receiverTokenAccount.address,
      payer,
      transferAmount
    );

    // Добавляем Memo (заметку)
    const memoInstruction = new TransactionInstruction({
      keys: [{ pubkey: payer.publicKey, isSigner: true, isWritable: true }],
      programId: MEMO_PROGRAM_ID,
      data: Buffer.from(`SPL Token Transfer #${i + 1} to Classmate`, "utf-8"),
    });

    const memoTx = new Transaction().add(memoInstruction);
    const memoSignature = await sendAndConfirmTransaction(connection, memoTx, [payer]);

    console.log(`Успешно переведено 100 токенов получателю ${receiver.publicKey.toBase58()}`);
    console.log(`Memo Signature: https://explorer.solana.com/tx/${memoSignature}?cluster=devnet`);
  }

  console.log("\n🎉 Задание Недели 2 полностью выполнено!");
}

main();