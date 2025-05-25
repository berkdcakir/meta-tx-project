require('dotenv').config();
const { ethers } = require('ethers');

const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
const tokenAbi = [
  'function balanceOf(address) view returns (uint256)',
  'function decimals() view returns (uint8)',
];

const TOKEN_ADDRESS = process.env.TOKEN_ADDRESS;
const USER_ADDRESS = process.env.USER_ADDRESS;
const RELAYER_ADDRESS = new ethers.Wallet(process.env.PRIVATE_KEY_RELAYER, provider).address;

async function main() {
  const args = process.argv.slice(2);
  const target = args[0] === 'user' ? USER_ADDRESS : RELAYER_ADDRESS;
  const label = args[0] === 'user' ? 'User' : 'Relayer';

  const token = new ethers.Contract(TOKEN_ADDRESS, tokenAbi, provider);
  const decimals = await token.decimals();
  const balance = await token.balanceOf(target);
  const ethBalance = await provider.getBalance(target);

  console.log(`${label} address: ${target}`);
  console.log(`ETH balance: ${ethers.formatEther(ethBalance)} ETH`);
  console.log(`Token balance: ${ethers.formatUnits(balance, decimals)} TestUSDC`);
}

main();
