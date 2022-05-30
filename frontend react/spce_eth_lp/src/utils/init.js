import { ethers } from "ethers";
const { formatEther } = ethers.utils;
const {
  signer,
  provider,
  spaceCoinICOContract,
  LPContract,
  spaceCoinContract,
} = window;

const ICOPhases = {
  0: "Seed",
  1: "General",
  2: "Open",
};

export const getICOPhase = async () => {
  return ICOPhases[await spaceCoinICOContract.ICOPhase()];
};

export const connectToMetamask = async () => {
  try {
    const address = await signer.getAddress();
    console.log("Signed in", address);
    return address;
  } catch (err) {
    console.log("Not signed in");
    await provider.send("eth_requestAccounts", []);
  }
};

export const getSignerBalance = async () => {
  const address = await signer.getAddress();
  return formatEther(await provider.getBalance(address));
};

export const getSignerSPCEBalance = async () => {
  const address = await signer.getAddress();
  return formatEther(await spaceCoinContract.balanceOf(address));
};

export const getPoolReserves = async () => {
  const ethReserve = formatEther(await LPContract.ethReserve());
  const spceReserve = formatEther(await LPContract.spceReserve());
  return { ethReserve, spceReserve };
};

export const getSignerLPTokens = async () => {
  const address = await signer.getAddress();
  return formatEther(await LPContract.balanceOf(address));
};

export const getICOCoinsRemaining = async () => {
  return formatEther(
    await spaceCoinContract.balanceOf(spaceCoinICOContract.address)
  );
};
