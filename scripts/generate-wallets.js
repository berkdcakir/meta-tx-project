const fs = require("fs");
const { ethers } = require("ethers");

const WALLET_COUNT = 100;

async function main() {
  const wallets = [];

  for (let i = 0; i < WALLET_COUNT; i++) {
    const wallet = ethers.Wallet.createRandom();
    wallets.push({
      address: wallet.address,
      privateKey: wallet.privateKey
    });
  }

  fs.writeFileSync("wallets.json", JSON.stringify(wallets, null, 2));
  console.log(`✅ ${WALLET_COUNT} cüzdan oluşturuldu ve "wallets.json" dosyasına kaydedildi.`);
}

main().catch(console.error);

