const { ethers } = require("ethers");
const fs = require("fs");
require("dotenv").config();

async function main() {
  const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
  const relayer = new ethers.Wallet(process.env.PRIVATE_KEY_RELAYER, provider);

  const tokenAddress = process.env.TOKEN_ADDRESS;
  const metaTxAddress = process.env.METATX_CONTRACT;
  const targetAddress = process.env.USER_ADDRESS;

  const tokenName = "Test USD Coin"; 
  const version = "1"; 
  const chainId = (await provider.getNetwork()).chainId;

  const wallets = JSON.parse(fs.readFileSync("wallets.json")); 
  const fromList = [];
  const amountList = [];
  const deadlineList = [];
  const vList = [];
  const rList = [];
  const sList = [];

  const amount = ethers.parseUnits("1.0", 6);
  const deadline = Math.floor(Date.now() / 1000) + 3600;

  const domain = {
    name: tokenName,
    version,
    chainId,
    verifyingContract: tokenAddress,
  };

  const types = {
    Permit: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
      { name: "value", type: "uint256" },
      { name: "nonce", type: "uint256" },
      { name: "deadline", type: "uint256" },
    ],
  };

  const tokenAbi = ["function nonces(address) view returns (uint256)"];
  const token = new ethers.Contract(tokenAddress, tokenAbi, provider);

  console.log("⏳ İmzalar oluşturuluyor...");

  for (const privateKey of wallets.slice(0, 100)) {
    const user = new ethers.Wallet(privateKey, provider);
    const nonce = await token.nonces(user.address);

    const value = {
      owner: user.address,
      spender: metaTxAddress,
      value: amount,
      nonce,
      deadline,
    };

    const sig = await user.signTypedData(domain, types, value);
    const { v, r, s } = ethers.Signature.from(sig);

    fromList.push(user.address);
    amountList.push(amount);
    deadlineList.push(deadline);
    vList.push(v);
    rList.push(r);
    sList.push(s);
  }

  console.log("✅ İmzalar hazır, işlemler gönderiliyor...");

  const metaTxAbi = [
    "function executeBulkMetaTransferWithPermit(address,address,address[],uint256[],uint256[],uint8[],bytes32[],bytes32[])"
  ];
  const metaTx = new ethers.Contract(metaTxAddress, metaTxAbi, relayer);

  const tx = await metaTx.executeBulkMetaTransferWithPermit(
    tokenAddress,
    targetAddress,
    fromList,
    amountList,
    deadlineList,
    vList,
    rList,
    sList
  );

  console.log("📤 İşlem gönderildi:", tx.hash);
  await tx.wait();
  console.log("✅ İşlem başarıyla gerçekleşti.");
}

main().catch((err) => {
  console.error("❌ Hata:", err);
});

