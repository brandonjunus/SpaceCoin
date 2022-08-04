//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract RemoveLiquidity {
    function getEthAndSpceToRemove(
        uint256 _totalSupply,
        uint256 _lpTokens,
        uint256 _minEth,
        uint256 _minSpce,
        uint256 _ethReserve,
        uint256 _spceReserve
    ) internal pure returns (uint256 ethToRemove, uint256 spceToRemove) {
        require(
            _lpTokens > 0,
            "removeLiquidity: must input atleast 1 LP token"
        );
        ethToRemove = (_lpTokens * _ethReserve) / _totalSupply;
        spceToRemove = (_lpTokens * _spceReserve) / _totalSupply;
        require(ethToRemove > 0, "removeLiquidity: No eth to remove");
        require(spceToRemove > 0, "removeLiquidity: No spce to remove");
        require(
            ethToRemove >= _minEth,
            "removeLiquidity: Removing below min eth"
        );
        require(
            spceToRemove >= _minSpce,
            "removeLiquidity: Removing below min spce"
        );
        return (ethToRemove, spceToRemove);
    }
}
