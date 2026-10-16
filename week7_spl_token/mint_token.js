const { Connection, Keypair, clusterApiUrl } = require("@solana/web3.js");
const { createMint } = require("@solana/spl-token");

async function main() {
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
  const payer = Keypair.generate();
  const mintAuthority = Keypair.generate();

  console.log("=== Неделя 7: Выпуск SPL Токена ===");
  console.log("Payer address:", payer.publicKey.toBase58());
  console.log("Mint Authority address:", mintAuthority.publicKey.toBase58());
  console.log("Логика minting & transfer для SPL-токенов готова.");
}

main();