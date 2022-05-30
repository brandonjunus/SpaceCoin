import { ethers } from "ethers";

export const parseEther = (numberString) =>
  ethers.utils.parseEther(numberString);

const parseEthers = (numberStringArray) =>
  numberStringArray.map((numberString) => parseEther(numberString));

// all params as strings
export const getSwapValues = (aReserve, bReserve, aSwapped) => {
  [aReserve, bReserve, aSwapped] = parseEthers([aReserve, bReserve, aSwapped]);
  const aReserveAfterSwap = aReserve.add(aSwapped);
  const k = aReserve.mul(bReserve);
  let amtBAfter = k.div(aReserveAfterSwap);
  let amtBtoTransferBeforeFee = bReserve.sub(amtBAfter);
  let transferFee = amtBtoTransferBeforeFee.mul(1).div(100);
  let bBalanceAfter = bReserve.sub(amtBtoTransferBeforeFee).add(transferFee);
  let amtBToTransfer = amtBtoTransferBeforeFee.sub(transferFee);
  amtBToTransfer = ethers.utils.formatEther(amtBtoTransferBeforeFee);
  return { amtBToTransfer, bBalanceAfter, transferFee };
};

export const increaseSpceAllowance = async (spce) => {
  await window.spaceCoinContract.increaseAllowance(
    window.LPContract.address,
    ethers.utils.parseEther(spce.toString())
  );
};
