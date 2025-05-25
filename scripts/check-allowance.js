const { ethers } = require("ethers");
require("dotenv").config();

async function main() {
  const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
  const tokenAddress = process.env.TOKEN_ADDRESS;

  const owner = "0xD87fa1b58BB2bAedC8DaEE664eB3dFB53d7da864"; // kullanıcı
  const spender = "0x242b9dE3c4B7575715aB804616AF926a4EEa4667"; // MetaTx

  const code = await provider.getCode(tokenAddress);
  console.log("📦 Contract bytecode:", code);

  if (code === "0x") {
    throw new Error("❌ Genel hata: Token contract not deployed at this address!");
  }

  const abi = [
    "function name() view returns (string)",
    "function allowance(address, address) view returns (uint256)"
  ];

  const contract = new ethers.Contract(tokenAddress, abi, provider);

  try {
    const name = await contract.name();
    console.log(`🎯 Token name: ${name}`);
  } catch (e) {
    console.error("❌ Token info alınamadı:", e.message);
  }

  try {
    const allowance = await contract.allowance(owner, spender);
    console.log(`🧾 Allowance: ${allowance.toString()}`);
  } catch (e) {
    console.error("❌ Allowance okunamadı:", e.message);
  }
}

main().catch((err) => console.error("❌ Genel hata:", err.message));












