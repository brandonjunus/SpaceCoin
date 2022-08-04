//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract AddLiquidity {
    function getOptimalAmounts(
        uint256 _ethDesired,
        uint256 _spceDesired,
        uint256 _minEth,
        uint256 _minSpce,
        uint256 _ethReserve,
        uint256 _spceReserve
    ) internal pure returns (uint256 ethToTransfer, uint256 spceToTransfer) {
        if (_ethReserve == 0 && _spceReserve == 0) {
            (ethToTransfer, spceToTransfer) = (_ethDesired, _spceDesired);
        } else {
            uint256 optimalSpce = quote(_ethDesired, _ethReserve, _spceReserve);
            if (optimalSpce <= _spceDesired) {
                require(
                    optimalSpce >= _minSpce,
                    "getOptimalAmounts: Insufficent SPCE"
                );
                return (_ethDesired, optimalSpce);
            } else {
                uint256 optimalEth = quote(
                    _spceDesired,
                    _spceReserve,
                    _ethReserve
                );
                // need this to check if something's messed up with the quoting
                // why is it an asser though (vs a require?)
                assert(optimalEth <= _ethDesired);
                require(
                    optimalEth >= _minEth,
                    "getOptimalAmounts: Insufficent ETH"
                );
                return (optimalEth, _spceDesired);
            }
        }
    }

    function quote(
        uint256 _amountA,
        uint256 _reserveA,
        uint256 _reserveB
    ) private pure returns (uint256 amountB) {
        require(_amountA > 0, "quote: Invalid amount A");
        require(
            _reserveA > 0 && _reserveB > 0,
            "quote: No liquidity to compare against"
        );
        return (_amountA * _reserveB) / _reserveA;
    }

    function getTokensToMint(
        uint256 _optimalEth,
        uint256 _optimalSpce,
        uint256 _totalSupply,
        uint256 _ethReserve,
        uint256 _spceReserve
    ) internal pure returns (uint256 tokensToMint) {
        // initalize the LP if total supply == 0;
        if (_totalSupply == 0) {
            // if new LP, mint lesser of eth or spce
            return min(_optimalEth, _optimalSpce);
        } else {
            tokensToMint = min(
                (_optimalEth * _totalSupply) / _ethReserve,
                (_optimalSpce * _totalSupply) / _spceReserve
            );
            require(tokensToMint > 0, "getTokensToMint: Made 0 LP Tokens");
            return tokensToMint;
        }
    }

    function min(uint256 _amountA, uint256 _amountB)
        private
        pure
        returns (uint256 minOfAorB)
    {
        return _amountA < _amountB ? _amountA : _amountB;
    }
}
