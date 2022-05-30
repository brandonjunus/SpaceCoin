READ ME!

-- NO ROUTER --

I didn't make a router for this project for a few reasons:

1. No router = less code
   Less code means there's less potential to have security issues. The logic is much simplier and therefore there's less chance of writing code that is vulerable to attack.
2. Doesn't need to scale
   I built this project without the intention of scaling (eg. building out a system with numerous LP's, allowing for ondemand creation of new LP's that don't yet exist, etc.) Since this was the case, the router is not needed, and therefore I can get away with writing less code by not using a router.

I do aknowledge that routers for uniswap and in the real world are useful for many reasons:

1. Scalability
   As previously mentioned, a router would allow for scaling to multiple LP's. The router deploys new LPs if user is trying to add liquidity to a pair that does not yet exist.
2. UX
   If you wanted to swap and there were 100s of LP's in the real world, it would be easier to learn how to use the router only once and send your function call to the router, rather than having to find a listing of all the different LP's (if it exists) and sending your function call to those instead.
3. Upgradeability
   If a new features are needed, and you used the router, it would be much easier to upgrade as you can upgrade the features in the router and point them to the LP's. This doesn't allow you to upgrade features in each individual LP, but it does offer some level of upgradeability
4. Gas savings
   If we needed to do multiple swaps in a more complicated scaled out version of an LP system, then we would only need to add allowance to the router once and have do all the swapping for us.

-- FEE IS CALCULATED ON SWAP OUT --

See Swap.sol for details

Basically the 1% deduction is calculated on the amount to be transfered out, not the amount to be transfered in. Not sure if a dedcution on transfer in or out would be better, but just noting here that I did it this way.

-- DESIGN QUESTION --
How would you extend your LP contract to award additional rewards – say, a separate ERC-20 token – to further incentivize liquidity providers to deposit into your pool?

How you setup a reward system for contributing LPs would be based on what the rewards actually are, but for my simple example here, I'm going to make an erc20 token called BrandonSwapToken($BS) which you can buy special BS NFTS with lol.

Lets say there's a monthly drop of BS NFTs that can only be purcahsed with BS coins, which are there to incentivize users to keep their capital in my BS swap LP's as long as possible.

So first you need to keep track of how many tokens a user had at a start of a period, and total tokens for the start of a period (lets call the period every 30 days). At the start of every new 30 days we'll add a new timestamp to the mapping.

mapping (uint256 timestamp => totalsupply) totalSUpplyAtPeriodStart;
mapping (uint256 timestamp => mapping(address => uint256)) userTokensAtPeriodStart;

We'll also total the fees collected for a period, which is incremented each time a fee is collected (eg. when a swap is made).
mapping (uint256 timestamp => uint256 feesCollected) feesCollected;

Then when a user removes liquidity, we'll check what % of the total supply they owned at each period and multiply that by fees collected, and mint that number of $bs tokens to the user.

Where this gets a bit funky is with multiple tokens with different USD valueations. I suppose we'd want to give users BS tokens relative to the value of their contributions to LP's, meaning we SHOULD give them more BS tokens if they contribute 1ETH and 1BTC to a ETH/BTC LP than if they contribute 1ETH and 1SPC to a ETH/SPC LP.

I suppose this could be done via an orcale or something to compare last USD sale price on binance or coinbase? or some other api, but I will stop the design exersize here just because the rest would take too much speculation on what the motivations for the BS token actually are.
