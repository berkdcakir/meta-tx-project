const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("🚀 Deploying with:", deployer.address);

  const Token = await hre.ethers.getContractFactory("TestUSDC");
  const token = await Token.deploy(deployer.address); 

  await token.waitForDeployment();

  const tokenAddress = await token.getAddress();
  console.log("✅ TestUSDC deployed to:", tokenAddress);
}

main().catch((error) => {
  console.error("❌ Deploy failed:", error);
  process.exitCode = 1;
});

