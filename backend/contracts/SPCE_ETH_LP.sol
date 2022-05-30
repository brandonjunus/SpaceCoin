//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./SpaceCoinICO.sol";
import "./SpaceCoin.sol";
import "./AddLiquidity.sol";
import "./RemoveLiquidity.sol";
import "./Swap.sol";

import "hardhat/console.sol";

contract SPCE_ETH_LP is ERC20, AddLiquidity, Swap, RemoveLiquidity {
    uint8 public constant swapFeePercentage = 1;
    uint256 public constant DECIMAL = 10**18;
    SpaceCoin public immutable spaceCoin;

    uint256 public spceReserve;
    uint256 public ethReserve;

    constructor(address _spaceCoinAddress) ERC20("SPCE_ETH_LP", "SPCE_ETH") {
        spaceCoin = SpaceCoin(_spaceCoinAddress);
    }

    function getReserves()
        public
        view
        returns (uint256 _ethReserve, uint256 _spceReserve)
    {
        return (ethReserve, spceReserve);
    }

    function swap(uint256 _spceToSwap, uint256 _minReturn) external payable {
        require(
            _spceToSwap > 0 || msg.value > 0,
            "swap: Must send in either ETH or SPCE"
        );
        if (msg.value > 0) {
            require(_spceToSwap == 0, "swap: Eth swap, but spce was included");
            (uint256 _spceToTransfer, uint256 _newEthReserve) = getEthToSwap(
                msg.value,
                ethReserve,
                spceReserve,
                swapFeePercentage
            );
            require(
                _spceToTransfer > _minReturn,
                "swap: SPCE amt to recieve > minReturn"
            );
            ethReserve = _newEthReserve;
            spceReserve -= _spceToTransfer;
            spaceCoin.transfer(msg.sender, _spceToTransfer);
            emit SwapEvent(msg.value, _spceToTransfer, true, msg.sender);
        } else if (_spceToSwap > 0) {
            require(msg.value == 0, "swap: Spce swap, but eth was included");
            (uint256 _ethToTransfer, uint256 _newSpceReserve) = getSpceToSwap(
                _spceToSwap,
                ethReserve,
                spceReserve,
                swapFeePercentage
            );
            spceReserve = _newSpceReserve;
            require(
                _ethToTransfer > _minReturn,
                "swap: ETH amt to recieve > minReturn"
            );
            ethReserve -= _ethToTransfer;
            bool _transferSuccess = spaceCoin.transferFrom(
                msg.sender,
                address(this),
                _spceToSwap
            );
            require(_transferSuccess, "swap: spceSwap: Transfer failed");
            (bool _success, bytes memory msgData) = msg.sender.call{
                value: _ethToTransfer
            }("");
            require(_success, "swap: Unsuccesful swap for SPCE");
            emit SwapEvent(_ethToTransfer, _spceToSwap, false, msg.sender);
        }
    }

    function removeLiquidity(
        uint256 _lpTokens,
        uint256 _minEth,
        uint256 _minSpce
    ) external {
        require(
            balanceOf(msg.sender) >= _lpTokens,
            "removeLiquidity: Trying to redeem too many tokens"
        );
        (uint256 _ethToRemove, uint256 _spceToRemove) = getEthAndSpceToRemove(
            totalSupply(),
            _lpTokens,
            _minEth,
            _minSpce,
            ethReserve,
            spceReserve
        );
        ethReserve -= _ethToRemove;
        spceReserve -= _spceToRemove;
        _burn(msg.sender, _lpTokens);
        bool _transferSuccess = spaceCoin.transfer(msg.sender, _spceToRemove);
        require(_transferSuccess, "remove liquidity: eth transfer failed");
        (bool _ethTransferSuccess, bytes memory msgData) = msg.sender.call{
            value: _ethToRemove
        }("");
        require(_ethTransferSuccess, "remove liquidity: eth transfer failed");
        emit RemoveLiquidityEvent(
            _ethToRemove,
            _spceToRemove,
            _lpTokens,
            msg.sender
        );
    }

    function addLiquidity(
        uint256 _ethDesired,
        uint256 _spceDesired,
        uint256 _ethMinimum,
        uint256 _spceMinimum
    )
        external
        payable
        virtual
        returns (
            uint256 _optimalEth,
            uint256 _optimalSpce,
            uint256 _tokensToMint
        )
    {
        (_optimalEth, _optimalSpce) = getOptimalAmounts(
            _ethDesired,
            _spceDesired,
            _ethMinimum,
            _spceMinimum,
            ethReserve,
            spceReserve
        );
        require(
            msg.value >= _optimalEth,
            "addLiquidity: not enough eth contributed"
        );
        _tokensToMint = getTokensToMint(
            _optimalEth,
            _optimalSpce,
            totalSupply(),
            ethReserve,
            spceReserve
        );
        ethReserve += _optimalEth;
        spceReserve += _optimalSpce;
        spaceCoin.transferFrom(msg.sender, address(this), _optimalSpce);
        _mint(msg.sender, _tokensToMint);
        uint256 remainingEth = msg.value - _optimalEth;
        if (remainingEth > 0) {
            (bool _success, bytes memory returndata) = msg.sender.call{
                value: remainingEth
            }("");
            require(_success, "Remaining Eth Return failed");
        }
        emit AddLiquidityEvent(
            _optimalEth,
            _optimalSpce,
            _tokensToMint,
            msg.sender
        );
        return (_optimalEth, _optimalSpce, _tokensToMint);
    }

    event AddLiquidityEvent(
        uint256 optimalEth,
        uint256 optimalSpce,
        uint256 tokensToMint,
        address indexed to
    );
    event SwapEvent(
        uint256 ethSwapped,
        uint256 spceSwapped,
        bool isEthToSpce,
        address indexed to
    );
    event RemoveLiquidityEvent(
        uint256 ethToRemove,
        uint256 spceToRemove,
        uint256 tokensBurned,
        address indexed to
    );
}
