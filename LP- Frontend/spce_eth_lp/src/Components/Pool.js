import React, { useState } from "react";
import { increaseSpceAllowance } from "../utils/utils";
import { parseEther } from "ethers/lib/utils";

export default function Pool({
  poolEthReserve,
  poolSpceReserve,
  signerLPTokens,
}) {
  const [ethInput, setEthInput] = useState(0);
  const [spceInput, setSpceInput] = useState(0);
  const [lpWithdrawlInput, setLPWithdrawlInput] = useState(0);
  const addLiquidity = async (e) => {
    e.preventDefault();
    await window.LPContract.addLiquidity(
      parseEther(ethInput.toString()),
      parseEther(spceInput.toString()),
      0,
      0,
      { value: parseEther(ethInput.toString()) }
    );
  };
  const increaseAllowance = async (e) => {
    e.preventDefault();
    await increaseSpceAllowance(spceInput);
  };
  const removeLiquidityAll = async (e) => {
    e.preventDefault();
    await removeLiquidity(parseEther(signerLPTokens.toString()));
  };
  const removeLiquidityTokens = async (e) => {
    e.preventDefault();
    await removeLiquidity(parseEther(lpWithdrawlInput.toString()));
  };
  const removeLiquidity = async (lpTokens) => {
    await window.LPContract.removeLiquidity(lpTokens, 0, 0);
  };

  return (
    <section>
      <h2>Pool</h2>
      <p>LP Tokens Owned: {signerLPTokens}</p>
      <p>ETH Reserve: {poolEthReserve}</p>
      <p>SPCE Reserve: {poolSpceReserve}</p>
      <form id='lp_deposit'>
        Deposit for LP tokens (mins set to 0) <br />
        <input
          name='eth'
          onChange={(e) => setEthInput(e.target.value)}
          value={ethInput}
        />
        ETH
        <br />
        <input
          name='spc'
          onChange={(e) => setSpceInput(e.target.value)}
          value={spceInput}
        />
        SPC
        <button onClick={increaseAllowance}>Increase Allownce</button>
        <br />
        <button onClick={addLiquidity}>Deposit</button>
      </form>
      <form id='lp_withdraw'>
        Withdraw from pool (mins set to 0)
        <br />
        <input
          name='LP_WITHDRAWL'
          onChange={(e) => setLPWithdrawlInput(e.target.value)}
          value={lpWithdrawlInput}
        />
        <button onClick={(e) => removeLiquidityTokens(e)}>Withdraw</button>
        <br />
        OR
        <br />
        <button onClick={(e) => removeLiquidityAll(e)}>Withdraw All</button>
      </form>
    </section>
  );
}
