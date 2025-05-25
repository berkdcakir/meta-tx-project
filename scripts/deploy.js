const hre = require("hardhat");

async function main() {
  const MetaTx = await hre.ethers.getContractFactory("MetaTx");
  const contract = await MetaTx.deploy();

  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log("✅ MetaTx deployed to:", address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
