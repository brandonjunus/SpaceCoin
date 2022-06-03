import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import SpaceCoinICOJSON from "../contracts/SpaceCoinICO.json";
// import SpaceCoinICOJSON from "../artifacts/contracts/SpaceCoinICO.sol/SpaceCoinICO.json";
import {
  getICOPhase,
  connectToMetamask,
  getIsSeedWhitelisted,
  getReedeemableContributions,
} from "../utils/init";
const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();

const spaceCoinICOAddr = "0x02a38970837a1597e9d139fd690007041b963fba";
const spaceCoinICOContract = new ethers.Contract(
  spaceCoinICOAddr,
  SpaceCoinICOJSON.abi,
  signer
);

window.ethers = ethers;
window.provider = provider;
window.signer = signer;
window.contract = spaceCoinICOContract;

export default function App() {
  const [ICOPhase, setICOPhase] = useState();
  const [isSeedWhitelisted, setIsSeedWhitelisted] = useState(false);
  const [reedeemableContributions, setReedeemableContributions] = useState(0);
  const [signerAddress, setSignerAddress] = useState("");

  const [addToWhitelistAddress, setAddToWhitelistAddress] = useState("");
  const [ETHToContribute, setETHToContribute] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    init();
  }, [signer]);
  const init = async () => {
    setSignerAddress(await connectToMetamask());
    setICOPhase(await getICOPhase());
    setIsSeedWhitelisted(await getIsSeedWhitelisted());
    setReedeemableContributions(await getReedeemableContributions());
  };

  const addToWhitelist = async () => {
    const signerAddress = await signer.getAddress();
    try {
      await window.contract.addToWhitelist(signerAddress);
    } catch (e) {
      console.log("e", e);
      setErrorMessage(e?.error?.message ?? e?.message);
    }
  };

  const contributeETH = async () => {
    const eth = ethers.utils.parseEther(ETHToContribute);
    try {
      await window.contract.contribute({ value: eth });
    } catch (e) {
      console.log("e", e);
      setErrorMessage(e?.error?.message ?? e?.message);
    }
  };

  return (
    <div>
      <h1>SpaceCoin ICO! </h1>
      <h2>Phase: {ICOPhase}</h2>
      <ul>
        <li>Your Address: {signerAddress}</li>
        <li>Seed Whitelisted: {isSeedWhitelisted ? "Yes" : "No"}</li>
        <li>Amt Contributed to ICO: {reedeemableContributions} ETH</li>
        <li>Reedemable SPCE: {reedeemableContributions * 5} SPCE</li>
      </ul>
      <div>
        <button onClick={contributeETH}>Contribute ETH</button>
        <input
          onChange={(e) => setETHToContribute(e.target.value)}
          value={ETHToContribute}
        />
      </div>
      <div>
        <button onClick={addToWhitelist}>Add Address to whitelist</button>
        <input
          onChange={(e) => setAddToWhitelistAddress(e.target.value)}
          value={addToWhitelistAddress}
        />
      </div>
      <div>{errorMessage && "Error: " + errorMessage}</div>
    </div>
  );
}
