const { ethers } = require("ethers");
require("dotenv").config();

async function main() {
  const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
  const userSigner = new ethers.Wallet(process.env.PRIVATE_KEY_USER, provider);
  const relayerSigner = new ethers.Wallet(process.env.PRIVATE_KEY_RELAYER, provider);

  const tokenAddress = process.env.TOKEN_ADDRESS;
  const metaTxAddress = process.env.METATX_CONTRACT;
  const metaTxAbi = [
    "function nonces(address) view returns (uint256)",
    "function getDigest(address,uint256,address,address,uint256) pure returns (bytes32)",
    "function executeMetaTransaction(address,address,address,uint256,uint8,bytes32,bytes32)",
    "function debugSigner(bytes32,uint8,bytes32,bytes32) pure returns (address)"
  ];
  const metaTx = new ethers.Contract(metaTxAddress, metaTxAbi, relayerSigner);
  const userAddress = await userSigner.getAddress();
  const to = "0x000000000000000000000000000000000000dEaD";
  const amount = 10000;

  const nonce = await metaTx.nonces(userAddress);
  console.log("🔢 Nonce:", nonce.toString());

  const digest = await metaTx.getDigest(tokenAddress, nonce, userAddress, to, amount);
  const { r, s, v } = ethers.Signature.from(await userSigner.signingKey.sign(digest));

  console.log("✅ Recovered:", await metaTx.debugSigner(digest, v, r, s));
  const tx = await metaTx.executeMetaTransaction(tokenAddress, userAddress, to, amount, v, r, s);
  console.log("📤 Tx hash:", tx.hash);
  await tx.wait();
  console.log("✅ Tx confirmed");
}

main().catch(console.error);