const anchor = require("@coral-xyz/anchor");

async function main() {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  // Находим детерминированный PDA адрес профиля для текущего кошелька
  const [profilePda, bump] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("user_profile"), provider.wallet.publicKey.toBuffer()],
    new anchor.web3.PublicKey("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS")
  );

  console.log("=== On-Chain Profile через PDA (Неделя 6) ===");
  console.log("Публичный ключ пользователя:", provider.wallet.publicKey.toBase58());
  console.log("Сгенерированный PDA адрес профиля:", profilePda.toBase58());
  console.log("Bump:", bump);
}

main();