require("dotenv").config();
const { ethers } = require("ethers");

async function main() {
  const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
  const userSigner = new ethers.Wallet(process.env.PRIVATE_KEY_USER, provider);
  const relayerSigner = new ethers.Wallet(process.env.PRIVATE_KEY_RELAYER, provider);

  const metaTxAddress = process.env.METATX_CONTRACT;
  const tokenAddress = process.env.TOKEN_ADDRESS;

  const abi = [
    "function nonces(address) view returns (uint256)",
    "function getBulkDigest(address,uint256,address,address[],uint256[]) view returns (bytes32)",
    "function debugSigner(bytes32,uint8,bytes32,bytes32) view returns (address)",
    "function executeMetaTransactionBulk(address,address,address[],uint256[],uint8,bytes32,bytes32)"
  ];

  const metaTx = new ethers.Contract(metaTxAddress, abi, relayerSigner);
  const userAddress = await userSigner.getAddress();

  // 100 sahte adres üretimi
  const toList = [];
  const amountList = [];
  for (let i = 0; i < 100; i++) {
    const dummy = ethers.Wallet.createRandom().address;
    toList.push(dummy);
    amountList.push(ethers.parseUnits("0.1", 6)); 
  }

  const nonce = await metaTx.nonces(userAddress);
  console.log("🔢 Nonce:", nonce.toString());

  const digest = await metaTx.getBulkDigest(tokenAddress, nonce, userAddress, toList, amountList);
  const signature = await userSigner.signingKey.sign(digest);
  const { r, s, v } = ethers.Signature.from(signature);

  const recovered = await metaTx.debugSigner(digest, v, r, s);
  console.log("✅ Recovered:", recovered);

  const tx = await metaTx.executeMetaTransactionBulk(
    tokenAddress,
    userAddress,
    toList,
    amountList,
    v,
    r,
    s
  );

  console.log("📤 Transaction gönderildi. Tx hash:", tx.hash);
  await tx.wait();
  console.log("✅ İşlem onaylandı.");
}

main().catch((err) => {
  console.error("❌ Hata:", err);
});







