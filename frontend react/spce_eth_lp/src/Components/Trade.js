import React, { useState } from "react";

import { getSwapValues, increaseSpceAllowance } from "../utils/utils";
import { parseEther } from "ethers/lib/utils";
export default function Trade({ poolEthReserve, poolSpceReserve }) {
  const [spceInput, setSpceInput] = useState(0);
  const [ethInput, setEthInput] = useState(0);
  const [minEthOutInput, setMinEthOutInput] = useState(0);
  const [minSpceOutInput, setMinSpceOutInput] = useState(0);
  const [ethEstimate, setEthEstimate] = useState(0);
  const [spceEstimate, setSpceEstimate] = useState(0);
  const onChangeSpceInput = async (e) => {
    e.preventDefault();
    setSpceInput(e.target.value);
    const { amtBToTransfer } = getSwapValues(
      poolSpceReserve,
      poolEthReserve,
      e.target.value
    );
    setEthEstimate(amtBToTransfer);
  };
  const onChangeEthInput = async (e) => {
    e.preventDefault();
    setEthInput(e.target.value);
    const { amtBToTransfer } = getSwapValues(
      poolEthReserve,
      poolSpceReserve,
      e.target.value
    );
    setSpceEstimate(amtBToTransfer);
  };
  const tradeSpce = async (e) => {
    e.preventDefault();
    await window.LPContract.swap(
      parseEther(spceInput),
      parseEther(minEthOutInput)
    );
  };
  const tradeEth = async (e) => {
    e.preventDefault();
    await window.LPContract.swap(
      0, // spceToSwap
      parseEther(minSpceOutInput),
      { value: parseEther(ethInput) }
    );
  };
  const increaseAllowance = async (e) => {
    e.preventDefault();
    await increaseSpceAllowance(spceInput);
  };

  return (
    <section>
      <h2>Trade</h2>
      <form id='swap_spce'>
        Trade SPCE for ETH <br />
        <input
          name='spce_amount_in'
          value={spceInput}
          onChange={(e) => onChangeSpceInput(e)}
        />
        <span id='swap_in_label'>SPCE IN</span>
        <br />
        <span id='swap_out_label'>Estimated Return Eth: {ethEstimate}</span>
        <br />
        <input
          name='min_eth_amount_out'
          value={minEthOutInput}
          onChange={(e) => setMinEthOutInput(e.target.value)}
        />
        <span>Min ETH Out</span>
        <br />
        <button onClick={(e) => tradeSpce(e)}>Trade</button>
        <button onClick={(e) => increaseAllowance(e)}>Increase Allownce</button>
      </form>
      <form id='swap_eth'>
        Trade ETH for SPCE <br />
        <input
          name='eth_amount_in'
          value={ethInput}
          onChange={(e) => onChangeEthInput(e)}
        />
        <span id='swap_in_label'>ETH IN</span>
        <br />
        <span id='swap_out_label'>Estimated Return SPCE: {spceEstimate}</span>
        <br />
        <input
          name='min_spce_amount_out'
          value={minSpceOutInput}
          onChange={(e) => setMinSpceOutInput(e.target.value)}
        />
        <span>Min SPCE Out</span>
        <br />
        <button onClick={(e) => tradeEth(e)}>Trade</button>
      </form>
    </section>
  );
}
