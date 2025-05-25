require("dotenv").config();
const { ethers } = require("ethers");


async function main() {
  const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);

  try {
    const blockNumber = await provider.getBlockNumber();
    console.log("✅ Sepolia ağına bağlısın. Son blok numarası:", blockNumber);
  } catch (err) {
    console.error("❌ Bağlantı kurulamadı. Hata:", err.message);
  }
}

main();
