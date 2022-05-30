//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;
import "./SpaceCoin.sol";

import "hardhat/console.sol";

contract Swap {
    function getEthToSwap(
        uint256 _ethToSwap,
        uint256 _ethReserve,
        uint256 _spceReserve,
        uint8 _swapFeePercentage
    ) internal pure returns (uint256 spceToTransfer, uint256 newEthReserve) {
        newEthReserve = _ethReserve + _ethToSwap;
        spceToTransfer =
            _spceReserve -
            (_ethReserve * _spceReserve) /
            newEthReserve;
        spceToTransfer =
            spceToTransfer -
            (spceToTransfer * _swapFeePercentage) /
            100;
        return (spceToTransfer, newEthReserve);
    }

    function getSpceToSwap(
        uint256 spceToSwap,
        uint256 _ethReserve,
        uint256 _spceReserve,
        uint8 _swapFeePercentage
    ) internal pure returns (uint256 ethToTransfer, uint256 newSpceReserve) {
        newSpceReserve = _spceReserve + spceToSwap;
        ethToTransfer =
            _ethReserve -
            (_ethReserve * _spceReserve) /
            newSpceReserve;
        ethToTransfer =
            ethToTransfer -
            (ethToTransfer * _swapFeePercentage) /
            100;
        return (ethToTransfer, newSpceReserve);
    }
}
