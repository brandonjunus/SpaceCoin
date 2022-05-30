import { ethers } from "ethers";

const ICOPhases = {
  0: "Seed",
  1: "General",
  2: "Open",
};

export async function getICOPhase() {
  return ICOPhases[await window.contract.ICOPhase()];
}

export async function connectToMetamask() {
  try {
    const address = await window.signer.getAddress();
    console.log("Signed in", address);
    return address;
  } catch (err) {
    console.log("Not signed in");
    await window.provider.send("eth_requestAccounts", []);
  }
}

export async function getIsSeedWhitelisted() {
  const signerAddress = await window.signer.getAddress();
  return await window.contract.seedWhitelist(signerAddress);
}

export async function getReedeemableContributions() {
  const signerAddress = await window.signer.getAddress();
  return ethers.utils.formatEther(
    await window.contract.reedeemableContributions(signerAddress)
  );
}
