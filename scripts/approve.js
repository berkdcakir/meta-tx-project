const { ethers } = require("ethers");
require("dotenv").config();

async function main() {
  const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
  const signer = new ethers.Wallet(process.env.PRIVATE_KEY_USER, provider);
  const tokenAddress = process.env.TOKEN_ADDRESS;

  const abi = [
    "function approve(address spender, uint256 amount) public returns (bool)"
  ];
  const token = new ethers.Contract(tokenAddress, abi, signer);

  const spender1 = process.env.METATX_CONTRACT;
  const spender2 = new ethers.Wallet(process.env.PRIVATE_KEY_RELAYER).address;

  const amount = ethers.parseUnits("1000", 6); // 

  const tx1 = await token.approve(spender1, amount);
  console.log("📤 Approve for MetaTx contract gönderildi:", tx1.hash);
  await tx1.wait();

  const tx2 = await token.approve(spender2, amount);
  console.log("📤 Approve for Relayer adresi gönderildi:", tx2.hash);
  await tx2.wait();

  console.log("✅ Her ikisi için approval tamam.");
}

main().catch((err) => {
  console.error("❌ Hata:", err);
});
