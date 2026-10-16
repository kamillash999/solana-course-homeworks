const {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  SystemProgram,
  Transaction,
  sendAndConfirmTransaction,
  clusterApiUrl,
} = require("@solana/web3.js");

async function main() {
  // Подключаемся к тестовой сети Devnet
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

  // 1. Генерируем два новых кошелька: отправитель и получатель
  const sender = Keypair.generate();
  const receiver = Keypair.generate();

  console.log("=== Задание 1: Первая транзакция Solana ===");
  console.log("Адрес отправителя:", sender.publicKey.toBase58());
  console.log("Адрес получателя:", receiver.publicKey.toBase58());

  // 2. Запрашиваем 1 тестовый SOL на кошелек отправителя
  console.log("\n1. Запрашиваем Airdrop (1 SOL)...");
  try {
    const airdropSig = await connection.requestAirdrop(
      sender.publicKey,
      1 * LAMPORTS_PER_SOL
    );
    const latestBlock = await connection.getLatestBlockhash();
    await connection.confirmTransaction({
      blockhash: latestBlock.blockhash,
      lastValidBlockHeight: latestBlock.lastValidBlockHeight,
      signature: airdropSig,
    });
    console.log("Airdrop успешно получен!");
  } catch (err) {
    console.log("Ошибка Airdrop:", err.message);
    return;
  }

  // 3. Формируем транзакцию перевода 0.1 SOL
  console.log("\n2. Формируем транзакцию перевода 0.1 SOL...");
  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: sender.publicKey,
      toPubkey: receiver.publicKey,
      lamports: 0.1 * LAMPORTS_PER_SOL, // 0.1 SOL = 100 000 000 Lamports
    })
  );

  // 4. Подписываем и отправляем транзакцию в сеть
  console.log("3. Отправляем в блокчейн...");
  const signature = await sendAndConfirmTransaction(
    connection,
    transaction,
    [sender]
  );

  // 5. Выводим результат и ссылки
  console.log("\n УСПЕШНО!");
  console.log(" Signature (Хэш):", signature);
  console.log(" Ссылка Explorer:", `https://explorer.solana.com/tx/${signature}?cluster=devnet`);
  console.log(" Ссылка Solscan:", `https://solscan.io/tx/${signature}?cluster=devnet`);
}

main();