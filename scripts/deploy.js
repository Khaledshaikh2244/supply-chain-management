
// const hre = require("hardhat");

// async function main() {

//   const lock = await hre.ethers.deployContract("Lock", [unlockTime], {
//     value: lockedAmount,
//   });

//   await lock.waitForDeployment();

//   console.log(
//     `Tracking deployed to ${lock.target}`
//   );
// }


// main().catch((error) => {
//   console.error(error);
//   process.exitCode = 1;
// });


const hre = require ("hardhat");
async function main(){

const Lock = await hre.ethers.getContractFactory("Tracking");
const lock = await Lock.deploy({value : lockedAmount});

await lock.deployed();

console.log(`Tracking deployed to ${lock.address}`);
}

main().catch((error)=> {
  console.error(error);
  process.exitCode = 1;
})