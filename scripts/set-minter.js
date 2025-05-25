const { ethers } = require("ethers");
require("dotenv").config();

async function main() {
  const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
  const ownerSigner = new ethers.Wallet(process.env.PRIVATE_KEY_USER, provider);

  const tokenAbi = [
    "function addMinter(address account) public",
    "function isMinter(address account) public view returns (bool)"
  ];

  const token = new ethers.Contract(process.env.TOKEN_ADDRESS, tokenAbi, ownerSigner);

  const relayerAddress = new ethers.Wallet(process.env.PRIVATE_KEY_RELAYER).address;

  const isAlreadyMinter = await token.isMinter(relayerAddress);
  if (isAlreadyMinter) {
    console.log("✅ Relayer zaten minter.");
    return;
  }

  const tx = await token.addMinter(relayerAddress);
  console.log("📤 Minter ekleniyor... Tx hash:", tx.hash);

  const receipt = await tx.wait();
  console.log("✅ Minter başarıyla eklendi. Block:", receipt.blockNumber);
}

main().catch(console.error);
