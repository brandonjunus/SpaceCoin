import { SPCE_ETH_LP } from "./../typechain-types/contracts/SPCE_ETH_LP";
import { BigNumber } from "ethers";

const getValuesFromLP = async (spce_eth_lp: SPCE_ETH_LP) => {
  const totalSupply = await spce_eth_lp.totalSupply();
  const ethReserve = await spce_eth_lp.ethReserve();
  const spceReserve = await spce_eth_lp.spceReserve();
  return { totalSupply, ethReserve, spceReserve };
};

export const getSwapValues = (
  aReserve: BigNumber,
  bReserve: BigNumber,
  aSwapped: BigNumber
) => {
  const aReserveAfterSwap = aReserve.add(aSwapped);
  const k = aReserve.mul(bReserve);
  let amtBAfter = k.div(aReserveAfterSwap);
  let amtBtoTransferBeforeFee = bReserve.sub(amtBAfter);
  let transferFee = amtBtoTransferBeforeFee.mul(1).div(100);
  let bBalanceAfter = bReserve.sub(amtBtoTransferBeforeFee).add(transferFee);
  let amtBToTransfer = amtBtoTransferBeforeFee.sub(transferFee);
  return { amtBToTransfer, bBalanceAfter, transferFee };
};

export const getTokensToMint = async (
  optimalEth: BigNumber,
  optimalSpce: BigNumber,
  spce_eth_lp: SPCE_ETH_LP
) => {
  const { totalSupply, ethReserve, spceReserve } = await getValuesFromLP(
    spce_eth_lp
  );
  const optimalEthBase = optimalEth.mul(totalSupply).div(ethReserve);
  const opitmalSpceBase = optimalSpce.mul(totalSupply).div(spceReserve);
  return optimalEthBase.lte(opitmalSpceBase) ? optimalEthBase : opitmalSpceBase;
};

export const getOptimalAmounts = async (
  ethDesired: BigNumber,
  spceDesired: BigNumber,
  spce_eth_lp: SPCE_ETH_LP
) => {
  const { ethReserve, spceReserve } = await getValuesFromLP(spce_eth_lp);
  const optimalSpce = quote(ethDesired, ethReserve, spceReserve);
  if (optimalSpce <= spceDesired) {
    return { optimalEth: ethDesired, optimalSpce: optimalSpce };
  } else {
    const optimalEth = quote(spceDesired, spceReserve, ethReserve);
    return { optimalEth: optimalEth, optimalSpce: spceDesired };
  }
};

export const quote = (
  amtA: BigNumber,
  reserveA: BigNumber,
  reserveB: BigNumber
) => {
  return amtA.mul(reserveB).div(reserveA);
};

export const getEthAndSpceToRemove = async (
  lpTokens: BigNumber,
  spce_eth_lp: SPCE_ETH_LP
) => {
  const { totalSupply, ethReserve, spceReserve } = await getValuesFromLP(
    spce_eth_lp
  );
  const ethToRemove = lpTokens.mul(ethReserve).div(totalSupply);
  const spceToRemove = lpTokens.mul(spceReserve).div(totalSupply);
  return { ethToRemove, spceToRemove };
};
