const hre = require("hardhat");

async function main() {
   [owner] = await ethers.getSigners();
   console.log(`Owner: ${owner.address}`);
  const contractName = 'Arb';
  await hre.run("compile");
  const smartContract = await hre.ethers.getContractFactory(contractName);
  const contract = await smartContract.deploy();
  await contract.deployed();
  console.log(`${contractName} deployed to: ${contract.address}`);  
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
