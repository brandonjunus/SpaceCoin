# SpaceCoin / SpaceCoinICO / SpaceCoin - Eth LP

A proof of concept defi lifecycle of the imaginary ERC-20 SpaceCoin Token.

### Contracts

**SpaceCoin (SPCE)**

- An ERC-20 token contract
- Includes togglable "tax" feature. If enabled, sends 2% of all transfer to a treasury account.

**SpaceCoinICO**

- A contract holding the business logic for the SpaceCoin ICO.
- The ICO will have three phases: Seed, General, and OPEN
  - Seed Phase: Contributions can only be made by allowlisted addresses. Individual contribution limited to 1.5k ether. Total contribution capped at 15k.
  - General Phase: Individual contribution limited to 1k ether. Total contribution capped at 30k.
  - Open Phase: Individual contribution limited to 1.5k ether. Total contribution capped at 30k. Contributions from all phases may now be redeemed for SpaceCoins

**SpaceCoin ETH Liquidity Pool**

- A Uniswap v2 style Liquidity Pool Contract designed to trade SPCE and ETH

### Front End

**SpaceCoin ICO**

- A simple front-end that allows contributions to the ICO

**SpaceCoin ICO**

- A simple front-end that allows users to add liquidity, remove liquidity and swap ETH or SPCE
