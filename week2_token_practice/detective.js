const { Connection, clusterApiUrl } = require("@solana/web3.js");

async function analyzeTransaction(txHash) {
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

  console.log("=== Transaction Detective ===");
  console.log("Анализ транзакции:", txHash);

  try {
    const tx = await connection.getParsedTransaction(txHash, {
      maxSupportedTransactionVersion: 0,
    });

    if (!tx) {
      console.log("Транзакция не найдена в Devnet. Проверьте Tx Hash!");
      return;
    }

    console.log("\n--- ACCOUNTS (Участники) ---");
    tx.transaction.message.accountKeys.forEach((acc, idx) => {
      console.log(`Account [${idx}]: ${acc.pubkey.toBase58()} (Signer: ${acc.signer}, Writable: ${acc.writable})`);
    });

    console.log("\n--- INSTRUCTIONS (Инструкции) ---");
    tx.transaction.message.instructions.forEach((inst, idx) => {
      console.log(`Instruction [${idx}]: Program ID -> ${inst.programId.toBase58()}`);
    });
  } catch (err) {
    console.error("Ошибка при получении транзакции:", err.message);
  }
}

// Вставляем ваш реальный Tx Hash из Devnet:
const sampleTx = "4JmbC5vMFr5wbbcpvN1VVbeKhYvWoWS8UPcvCi9RjbcUKbbNAUFnhQUpNXhESWMfwLcLU4Vezkvg91YDiBPGE6Cb";
analyzeTransaction(sampleTx);