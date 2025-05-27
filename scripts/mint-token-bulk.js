require("dotenv").config();
const { ethers } = require("ethers");
const fs = require("fs");

async function main() {
  const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);

  // 👑 Mint işlemini sadece kontrat sahibi yapacak
  const owner = new ethers.Wallet(process.env.PRIVATE_KEY_USER, provider);

  const tokenAddress = process.env.TOKEN_ADDRESS;
  const tokenAbi = [
    "function mint(address to, uint256 amount) public"
  ];

  const token = new ethers.Contract(tokenAddress, tokenAbi, owner);

  const walletKeys = JSON.parse(fs.readFileSync("wallets.json", "utf8"));
  const amount = ethers.parseUnits("1", 6); // 1 USDC

  for (let i = 0; i < walletKeys.length; i++) {
    const address = new ethers.Wallet(walletKeys[i]).address;

    try {
      const tx = await token.mint(address, amount);
      console.log(`✅ ${address} -> mint tx: ${tx.hash}`);
      await tx.wait();
    } catch (err) {
      console.error(`❌ ${address} mint FAILED:`, err.message);
    }
  }
}

main().catch(console.error);

