require("dotenv").config();
const { ethers } = require("ethers");

async function main() {
  const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
  const userWallet = new ethers.Wallet(process.env.PRIVATE_KEY_USER, provider);
  const relayerWallet = new ethers.Wallet(process.env.PRIVATE_KEY_RELAYER, provider);

  const tokenAddress = process.env.TOKEN_ADDRESS;
  const metaTxAddress = process.env.METATX_CONTRACT;
  const to = "0xYourReceiverAddressHere"; // B kişisinin adresi

  const abi = [
    "function nonces(address) view returns (uint256)",
    "function DOMAIN_SEPARATOR() view returns (bytes32)",
    "function transferFrom(address from, address to, uint256 amount) returns (bool)",
    "function permit(address owner,address spender,uint256 value,uint256 deadline,uint8 v,bytes32 r,bytes32 s)"
  ];

  const token = new ethers.Contract(tokenAddress, abi, provider);
  const metaTx = new ethers.Contract(metaTxAddress, ["function executeMetaTransfer(address,address,address,uint256,uint256,uint8,bytes32,bytes32)"], relayerWallet);

  const amount = ethers.parseUnits("1.0", 6);
  const nonce = await token.nonces(userWallet.address);
  const deadline = Math.floor(Date.now() / 1000) + 3600; // 1 saat içinde geçerli

  const domain = {
    name: "Test USD Coin",
    version: "1",
    chainId: (await provider.getNetwork()).chainId,
    verifyingContract: tokenAddress
  };

  const types = {
    Permit: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
      { name: "value", type: "uint256" },
      { name: "nonce", type: "uint256" },
      { name: "deadline", type: "uint256" }
    ]
  };

  const value = {
    owner: userWallet.address,
    spender: metaTxAddress,
    value: amount,
    nonce: nonce,
    deadline: deadline
  };

  const signature = await userWallet.signTypedData(domain, types, value);
  const { v, r, s } = ethers.Signature.from(signature);

  const tx = await metaTx.executeMetaTransfer(tokenAddress, userWallet.address, to, amount, deadline, v, r, s);
  console.log("📤 Meta transfer gönderildi:", tx.hash);
  await tx.wait();
  console.log("✅ Transfer tamamlandı.");
}

main().catch(console.error);
