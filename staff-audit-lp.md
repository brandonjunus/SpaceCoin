https://github.com/0xMacro/student.brandonjunus/tree/e31c6d58e0801ca583692ef683223795ebeac314/lp

Audited By: Gary

# General Comments

Thanks for providing an explanation on why you did not create a router contract even though the spec required it.
As you stated, with no router contract, there is less code and less potential to have security issues.  In fact,
that is the case with your LP project.  

The contract is well written, with good test coverage. However, you did miss testing the L-1 issue below.

You did a nice job of preventing the reentrancy vulnerability on the swap, removeLiquidity, and
addLiquidity functions by adhering to the checks-effects-interaction pattern. 

I am not sure your reasoning on creating separate contracts for functions related to adding liquidity, removing
liquidity and for the swap.  It is not necessary and will only increase the gas cost for each deployment.  

I did notice that you still have several quality issues that were noted previously in past micro-audits. You
should make an effort to ensure you address these issues as you work on the next projects.  

Good job with the React front-end! 

Overall great effort in this project.  It shows that you understand liquidity pools very well.

# Design Exercise

I was a little confused with your answer. The question was how to incentivize liquidity providers to deposit more
to your pool. You mentioned you would create a new ERC20 token ($BS), but you would mint the token when the 
liquidity provider removed liquidity. This would seem to me that you would be incentivizing the liquidity 
providers to remove liquidity not to deposit more. Also, you mentioned the valuation of the token and referred 
to a ETH/BTC LP. However, your pool only includes ETH/SPCE pairing.  Nonetheless, I appreciate your effort
in thinking about the solution and coming up with a thoughtful response. 

# Issues

**[L-1]** Tax on transfer of SpaceCoins 

In `SpaceCoin`  you have code in the `_transfer` function to not collect tax if the transfer is requested from 
the treasury or the SpaceCoin ICO contract.  However, in actuality, if the `isTransferTaxActive` is toggled on 
and the transfer request is coming from the treasury or the SpaceCoin ICO contract the tax is being applied.  
The issue is with line 35:36
```
bool taxActive = (from != treasury || from != address(spaceCoinICO)) &&
            isTrasferTaxActive;
```
It should not be an OR statment for double negative statement.  It should be an AND statement.
Consider changing the line to
```
bool taxActive = (from != treasury && from != address(spaceCoinICO)) &&
            isTrasferTaxActive;

```

**[Technical Mistake]** Pool's swap function does not account for feeOnTransfer tokens such as SPC

In your `swap`, `addLiquidity` and `removeLiquidity` functions you do not handle the case where the 2% fee on transfer tax is turned on for SPC. Your code assumes the `amount` argument in the `ERC20.transfer*` function will be equal to the amount actual received by the recipient. For a specific example, see these lines of your `swap` function:

```
spceReserve -= _spceToTransfer;
spaceCoin.transfer(msg.sender, _spceToTransfer);
```

The new value of `spceReserve` will be `_spceToTransfer * (2/100)` lower than the actual SPC token balance of the contract because of the tax.

**[Q-1]** Unused and Unneccessary getter function

`SPCE_ETH_LP ` has a public function `getReserves`.  However, it is never called within any functions of any of 
the contracts.  And it is not necessary for it to be called externally, because the two variables that are 
returned are public variables

In solidity - If you have public state variables in your contract, the compiler will create getter functions
for these automatically. Therefore, if you have already defined public state variables, you don't have to write
getter functions explicitly for those variables. It isn't recommended to write getter functions for public 
state variables.

**[Technical-Error-1]** Cannot remove liquidity if min Eth requested equals the calculated return Eth or the min 
Spce requested equals the calculated return SPCE. 

In `RemoveLiquidity` `getEthAndSpceToRemove` function, you are requiring that the calculated returned ETH and 
SPCE to be > then the min ETH and SPCE requested.  It should be greater or equal to the min requested.  If a 
liquidity provider wants the exact amount of ETH and SPCE, he/she will be unable to remove the requested 
liquidity.  

Consider changing lines 22 through 29 to:
```
require(
            ethToRemove >= _minEth,
            "removeLiquidity: Removing below min eth"
        );
        require(
            spceToRemove >= _minSpce,
            "removeLiquidity: Removing below min spce"
        );
```

**[Q-1]** Unused Constant Variable

In `SPCE_ETH_LP` the constant `DECIMAL` is defined, but not used

Consider removing `DECIMAL`  from your contract

**[Q-2]** `addLiquidity` function in `SPCE_ETH_LP` is defined with the keyword virtual.

Base functions can be overridden by inheriting contracts to change their behavior if they are marked as virtual. 
However, this contract is not being overridden, thus virtual keyword is unnecessary.

**[Q-3]** Leaving hardhat/console.sol in production project

Your contract imports hardhat/console.sol, which is a development package.

Consider removing hardhat/console.sol from your production code.


# Score

| Reason | Score |
|-|-|
| Late                       | - |
| Unfinished features        | - |
| Extra features             | - |
| Vulnerability              | 2 |
| Unanswered design exercise | - |
| Insufficient tests         | - |
| Technical mistake          | 2 |

Total: 4

Great job!
