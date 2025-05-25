const { ethers } = require("ethers");
require("dotenv").config();

async function main() {
  const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY_USER, provider);
  const tokenAddress = process.env.TOKEN_ADDRESS;

  const abi = [
    "function mint(address to, uint256 amount) external"
  ];

  const token = new ethers.Contract(tokenAddress, abi, wallet);
  const recipient = "0xD87fa1b58BB2bAedC8DaEE664eB3dFB53d7da864";

  const amount = ethers.parseUnits("150", 6); 

  const tx = await token.mint(recipient, amount);
  console.log("📤 Mint gönderildi. Tx hash:", tx.hash);
  await tx.wait();
  console.log("✅ İşlem onaylandı.");
}

main().catch((err) => {
  console.error("❌ Hata:", err);
});
