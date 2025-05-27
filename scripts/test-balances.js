// scripts/test-balances.js

const { ethers } = require("ethers");
const fs = require("fs");
require("dotenv").config();

async function main() {
  const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
  const token = new ethers.Contract(
    process.env.TOKEN_ADDRESS,
    ["function balanceOf(address) view returns (uint256)"],
    provider
  );

  const wallets = JSON.parse(fs.readFileSync("wallets.json"));

  for (let i = 0; i < 10; i++) {
    const address = new ethers.Wallet(wallets[i]).address;
    const balance = await token.balanceOf(address);
    console.log(`${address} => ${ethers.formatUnits(balance, 6)} USDC`);
  }
}

main();
