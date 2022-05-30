// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";
import {
  SpaceCoin,
  SpaceCoinICO,
  SpaceCoinICO__factory,
  SpaceCoin__factory,
  SPCE_ETH_LP,
  SPCE_ETH_LP__factory,
} from "../typechain-types";
const myPublicAddress = "0xf4c0d5E17f7EB81211b45485EE8c54C7cB2a2b20";
async function main() {
  const SpaceCoinICOFactory = (await ethers.getContractFactory(
    "SpaceCoinICO"
  )) as SpaceCoinICO__factory;
  const spaceCoinICO = await SpaceCoinICOFactory.deploy(myPublicAddress);
  console.log("spaceCoinICO deployed to:", spaceCoinICO.address);

  const SpaceCoinFactory = (await ethers.getContractFactory(
    "SpaceCoin"
  )) as SpaceCoin__factory;
  const spaceCoin = await SpaceCoinFactory.deploy(
    spaceCoinICO.address,
    myPublicAddress
  );
  console.log("spaceCoin deployed to:", spaceCoin.address);

  await spaceCoinICO.setSpaceCoinAddress(spaceCoin.address);

  const SPCE_ETH_LPFactory = (await ethers.getContractFactory(
    "SPCE_ETH_LP"
  )) as SPCE_ETH_LP__factory;
  const spce_eth_lp = await SPCE_ETH_LPFactory.deploy(spaceCoin.address);
  console.log("spce_eth_lp deployed to:", spce_eth_lp.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
