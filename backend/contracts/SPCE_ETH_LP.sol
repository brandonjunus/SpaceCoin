//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./SpaceCoinICO.sol";
import "./SpaceCoin.sol";
import "./AddLiquidity.sol";
import "./RemoveLiquidity.sol";
import "./Swap.sol";

/// @title SpaceCoin / Ethereum Liquidity Pool
/// @author Junus
contract SPCE_ETH_LP is ERC20, AddLiquidity, Swap, RemoveLiquidity {
    /// @notice Fee Percentage for swapping
    uint8 public constant FEE_PERCENTAGE = 1;

    /// @notice Reference to the SpaceCoin contract
    SpaceCoin public immutable spaceCoin;

    /// @notice SpaceCoin this contract has on reserve
    uint256 public spceReserve;

    /// @notice ETH this contract has on reserve
    uint256 public ethReserve;

    /// @notice Sets the SpaceCoin address and names the tokens associated with this LP

    constructor(address _spaceCoinAddress) ERC20("SPCE_ETH_LP", "SPCE_ETH") {
        spaceCoin = SpaceCoin(_spaceCoinAddress);
    }

    /// @notice Swaps ETH to SPCE or SPCE to ETH
    /// @dev If swapping ETH, must send msg.value and requires _spceToSwap to be 0
    /// If swapping SPCE, msg.value must be 0
    /// @param _spceToSwap Amount of SPCE to swap
    /// @param _minReturn Minimum amount of either ETH or SPCE to be returned from swap
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
                FEE_PERCENTAGE
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
                FEE_PERCENTAGE
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

    /// @notice Redeem LP tokens to remove liquidity from the contract
    /// @param _lpTokens Amount of LP tokens to be redeemed for SPCE / ETH
    /// @param _minEth Minimum ETH to be redeemed. Reverts if > than actual redeemed
    /// @param _minSpce Minimum SPCE to be redeemed. Reverts if > than actual redeemed
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

    /// @notice Add liquidity to the pool in exchange for LP tokens
    /// @param _ethDesired Amount of ETH to be deposited. Must be <= msg.value
    /// @param _spceDesired SPCE desired to be deposited
    /// @param _ethMinimum Minimum ETH to be deposited. Reverts if > actual ETH deposited
    /// @param _spceMinimum Minimum SPCE to be deposited. Reverts if > actual SPCE deposited
    function addLiquidity(
        uint256 _ethDesired,
        uint256 _spceDesired,
        uint256 _ethMinimum,
        uint256 _spceMinimum
    )
        external
        payable
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

    /// @notice Emitted when Liquidity is successfully added
    event AddLiquidityEvent(
        uint256 optimalEth,
        uint256 optimalSpce,
        uint256 tokensToMint,
        address indexed to
    );

    /// @notice Emitted when ETH or SPCE is swapped
    event SwapEvent(
        uint256 ethSwapped,
        uint256 spceSwapped,
        bool isEthToSpce,
        address indexed to
    );

    /// @notice Emitted when Liquidity is successfully removed
    event RemoveLiquidityEvent(
        uint256 ethToRemove,
        uint256 spceToRemove,
        uint256 tokensBurned,
        address indexed to
    );
}
