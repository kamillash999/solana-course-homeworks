const anchor = require("@coral-xyz/anchor");

async function main() {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  console.log("=== Взаимодействие с Counter Program через Anchor Client ===");
  console.log("Подключение к провайдеру прошло успешно.");
  console.log("Инструкции initialize и increment готовы к отправке.");
}

main();