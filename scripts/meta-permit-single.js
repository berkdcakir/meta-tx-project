require("dotenv").config();
const { ethers } = require("ethers");

async function main() {
  const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
  const user = new ethers.Wallet(process.env.PRIVATE_KEY_USER, provider);
  const relayer = new ethers.Wallet(process.env.PRIVATE_KEY_RELAYER, provider);

  const tokenAddress = process.env.TOKEN_ADDRESS;
  const metaTxAddress = process.env.METATX_CONTRACT;
  const tokenName = "Test USD Coin";
  const version = "1";
  const chainId = (await provider.getNetwork()).chainId;

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

  const nonce = await token.nonces(user.address);

  const value = {
    owner: user.address,
    spender: metaTxAddress,
    value: amount,
    nonce: nonce,
    deadline: deadline,
  };

  console.log("⏳ Permit imzası oluşturuluyor...");
  const signature = await user.signTypedData(domain, types, value);
  const { v, r, s } = ethers.Signature.from(signature);

  const metaTxAbi = [
    "function executeBulkMetaTransferWithPermit(address,address,address[],uint256[],uint256[],uint8[],bytes32[],bytes32[])"
  ];
  const metaTx = new ethers.Contract(metaTxAddress, metaTxAbi, relayer);

  const tx = await metaTx.executeBulkMetaTransferWithPermit(
    tokenAddress,
    process.env.USER_ADDRESS,
    [user.address],
    [amount],
    [deadline],
    [v],
    [r],
    [s]
  );

  console.log("📤 İşlem gönderildi:", tx.hash);
  await tx.wait();
  console.log("✅ Tekli permit ve transfer işlemi başarılı.");
}

main().catch((err) => {
  console.error("❌ Hata:", err);
});

