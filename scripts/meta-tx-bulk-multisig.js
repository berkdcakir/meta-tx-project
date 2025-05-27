require("dotenv").config();
const { ethers } = require("ethers");
const fs = require("fs");

async function main() {
  const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
  const relayer = new ethers.Wallet(process.env.PRIVATE_KEY_RELAYER, provider);

  const metaTxAddress = process.env.METATX_CONTRACT;
  const tokenAddress = process.env.TOKEN_ADDRESS;
  const targetAddress = process.env.TARGET_ADDRESS;

  const abi = [
    "function nonces(address) view returns (uint256)",
    "function getDigest(address,uint256,address,address,uint256) view returns (bytes32)",
    "function executeMetaTransactionBulkMultiSigner(address,address[],uint256[],address,uint8[],bytes32[],bytes32[])"
  ];

  const metaTx = new ethers.Contract(metaTxAddress, abi, provider);
  const metaTxWithRelayer = metaTx.connect(relayer);

  const walletKeys = JSON.parse(fs.readFileSync("wallets.json", "utf8"));
  const fromList = [];
  const amountList = [];
  const vList = [];
  const rList = [];
  const sList = [];

  for (let i = 0; i < walletKeys.length; i++) {
    const wallet = new ethers.Wallet(walletKeys[i], provider);
    const from = wallet.address;
    const amount = ethers.parseUnits("0.1", 6);
    const nonce = await metaTx.nonces(from);
    const digest = await metaTx.getDigest(tokenAddress, nonce, from, targetAddress, amount);

    const signature = await wallet.signingKey.sign(digest);
    const { v, r, s } = ethers.Signature.from(signature);

    fromList.push(from);
    amountList.push(amount);
    vList.push(v);
    rList.push(r);
    sList.push(s);
  }

  console.log(`🚀 Gönderim başlıyor: ${fromList.length} wallet → ${targetAddress}`);
  const tx = await metaTxWithRelayer.executeMetaTransactionBulkMultiSigner(
    tokenAddress, fromList, amountList, targetAddress, vList, rList, sList
  );
  console.log("📤 MetaTx gönderildi! Tx hash:", tx.hash);
  await tx.wait();
  console.log("✅ İşlem zincire yazıldı!");
}

main().catch(console.error);
