import React, { useEffect, useState } from "react";
import "../css/App.css";
import { ethers } from "ethers";
import {
  connectToMetamask,
  getICOCoinsRemaining,
  getICOPhase,
  getPoolReserves,
  getSignerBalance,
  getSignerLPTokens,
  getSignerSPCEBalance,
} from "../utils/init";
import SpaceCoinICOJSON from "../contracts/SpaceCoinICO.sol/SpaceCoinICO.json";
import SpaceCoinJSON from "../contracts/SpaceCoin.sol/SpaceCoin.json";
import LPJSON from "../contracts/SPCE_ETH_LP.sol/SPCE_ETH_LP.json";
import ICO from "./ICO";
import Pool from "./Pool";
import Trade from "./Trade";
import MetaStuff from "./MetaStuff";
const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();

const SPACECOIN_ICO_ADDRESS = "0xD2049A867f9e69Fe4eDce2F2bd91CDD61DF32b66";
const SPACECOIN_ADDRESS = "0xE7f3Aa42cB240C8f0A6f89f874Fbb559353b9896";
const LP_ADDRESS = "0x0340f836B92bB4BA624e1468E1eb0726bda3ABeA";
const spaceCoinICOContract = new ethers.Contract(
  SPACECOIN_ICO_ADDRESS,
  SpaceCoinICOJSON.abi,
  signer
);
const spaceCoinContract = new ethers.Contract(
  SPACECOIN_ADDRESS,
  SpaceCoinJSON.abi,
  signer
);
const LPContract = new ethers.Contract(LP_ADDRESS, LPJSON.abi, signer);

window.signer = signer;
window.provider = provider;
window.spaceCoinICOContract = spaceCoinICOContract;
window.spaceCoinContract = spaceCoinContract;
window.LPContract = LPContract;

function App() {
  const [signerAddress, setSignerAddress] = useState("");
  const [ICOPhase, setICOPhase] = useState();
  const [signerETHBalance, setSignerETHBalance] = useState(0);
  const [signerSPCEBalance, setSignerSPCEBalance] = useState(0);
  const [signerLPTokens, setSignerLPTokens] = useState(0);
  const [poolEthReserve, setPoolEthReserve] = useState(0);
  const [poolSpceReserve, setPoolSpceReserve] = useState(0);
  const [block, setBlock] = useState();
  const [ICOCoinsRemaining, setICOCoinsRemaining] = useState(0);

  useEffect(() => {
    init();
  }, []);

  provider.once("block", async (n) => {
    setBlock(n);
    const { ethReserve, spceReserve } = await getPoolReserves();
    setPoolEthReserve(ethReserve);
    setPoolSpceReserve(spceReserve);
    setSignerLPTokens(await getSignerLPTokens());
  });

  const init = async () => {
    setSignerAddress(await connectToMetamask(provider));
    setICOPhase(await getICOPhase());
    setSignerETHBalance(await getSignerBalance());
    setSignerSPCEBalance(await getSignerSPCEBalance());
    const { ethReserve, spceReserve } = await getPoolReserves();
    setPoolEthReserve(ethReserve);
    setPoolSpceReserve(spceReserve);
    setSignerLPTokens(await getSignerLPTokens());
    setBlock(await provider.getBlockNumber());
    setICOCoinsRemaining(await getICOCoinsRemaining());
  };

  return (
    <div>
      <h1>Project LP</h1>
      <MetaStuff
        signerAddress={signerAddress}
        signerETHBalance={signerETHBalance}
        signerSPCEBalance={signerSPCEBalance}
        block={block}
      />
      <ICO ICOPhase={ICOPhase} ICOCoinsRemaining={ICOCoinsRemaining} />
      <Pool
        poolEthReserve={poolEthReserve}
        poolSpceReserve={poolSpceReserve}
        signerLPTokens={signerLPTokens}
      />
      <Trade
        poolEthReserve={poolEthReserve}
        poolSpceReserve={poolSpceReserve}
      />
    </div>
  );
}

export default App;
