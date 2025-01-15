import { ethers } from "hardhat";

async function main() {
  const NFTFactory = await ethers.getContractFactory("NFTFactory");
  const factory = await NFTFactory.deploy();
  await factory.deployed();

  console.log("NFTFactory deployed to:", factory.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 