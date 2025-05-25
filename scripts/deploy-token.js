const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("🚀 Deploying with:", deployer.address);

  const Token = await ethers.getContractFactory("TestUSDC");
  const token = await Token.deploy(); 
  await token.waitForDeployment();

  console.log("✅ TestUSDC deployed to:", await token.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
