import {
  getEthAndSpceToRemove,
  getOptimalAmounts,
  getSwapValues,
  getTokensToMint,
} from "./testingUtils";
import { SPCE_ETH_LP__factory } from "../typechain-types/factories/contracts/SPCE_ETH_LP__factory";
import { SPCE_ETH_LP } from "../typechain-types/contracts/SPCE_ETH_LP";
import { LPRouter } from "../typechain-types/contracts/LPRouter";
import { SpaceCoin__factory } from "../typechain-types/factories/contracts/SpaceCoin__factory";
import { SpaceCoinICO } from "../typechain-types/contracts/SpaceCoinICO";
import { expect } from "chai";
import { ethers } from "hardhat";
import { BigNumber } from "ethers";
import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { SpaceCoin, SpaceCoinICO__factory } from "../typechain-types";

const ROUNDING: BigNumber = ethers.utils.parseEther(".0004");
const ONE_ETHER: BigNumber = ethers.utils.parseEther("1");
const FIVE_ETHER: BigNumber = ethers.utils.parseEther("5");
const TEN_ETHER: BigNumber = ethers.utils.parseEther("10");
const ONE_THOUSAND_ETHER: BigNumber = ethers.utils.parseEther("1000");
const TEN_THOUSAND_ETHER: BigNumber = ethers.utils.parseEther("10000");
const FIFTY_THOUSAND_ETHER: BigNumber = ethers.utils.parseEther("50000");

let deployer: SignerWithAddress;
let alice: SignerWithAddress;
let bob: SignerWithAddress;
let bob1: SignerWithAddress;
let bob2: SignerWithAddress;
let bob3: SignerWithAddress;
let bob4: SignerWithAddress;
let bob5: SignerWithAddress;
let bob6: SignerWithAddress;
let bob7: SignerWithAddress;
let bob8: SignerWithAddress;
let bob9: SignerWithAddress;
let bob10: SignerWithAddress;
let SpaceCoinICOFactory: SpaceCoinICO__factory; // how to hardtype this and add to typechain?
let spaceCoinICO: SpaceCoinICO; // how to hardtype this and add to typechain?
let SpaceCoinFactory: SpaceCoin__factory; // how to hardtype this and add to typechain?
let spaceCoin: SpaceCoin; // how to hardtype this and add to typechain?
let LPRouter: LPRouter;
let SPCE_ETH_LPFactory: SPCE_ETH_LP__factory;
let spce_eth_lp: SPCE_ETH_LP;
describe("LP Router Full Workflow Test", function () {
  beforeEach(async () => {
    [
      deployer,
      alice,
      bob,
      bob1,
      bob2,
      bob3,
      bob4,
      bob5,
      bob6,
      bob7,
      bob8,
      bob9,
      bob10,
    ] = await ethers.getSigners();
    SpaceCoinICOFactory = (await ethers.getContractFactory(
      "SpaceCoinICO"
    )) as SpaceCoinICO__factory;
    spaceCoinICO = await SpaceCoinICOFactory.deploy(deployer.address);
    SpaceCoinFactory = (await ethers.getContractFactory(
      "SpaceCoin"
    )) as SpaceCoin__factory;
    spaceCoin = await SpaceCoinFactory.deploy(
      spaceCoinICO.address,
      deployer.address
    );
    await spaceCoinICO.setSpaceCoinAddress(spaceCoin.address);
    SPCE_ETH_LPFactory = (await ethers.getContractFactory(
      "SPCE_ETH_LP"
    )) as SPCE_ETH_LP__factory;
    spce_eth_lp = await SPCE_ETH_LPFactory.deploy(spaceCoin.address);
  });

  it("ICO -> treasury withdraw -> Add liquidity -> Swap -> Remove Liquidity", async () => {
    // initialize LP to 10k ETH, 50k SPCE
    const provider = ethers.provider;
    await spaceCoinICO.advanceICOPhase(1);
    await spaceCoinICO.advanceICOPhase(2);
    const bobs = [bob, bob1, bob2, bob3, bob4, bob5, bob6, bob7, bob8, bob9];
    await Promise.all(
      bobs.map(async (bob) => {
        await spaceCoinICO
          .connect(bob)
          .contribute({ value: ONE_THOUSAND_ETHER });
      })
    );
    expect(await spaceCoinICO.totalContributed()).to.equal(
      ONE_THOUSAND_ETHER.mul(10)
    );
    // withdraw and addliquidity of 10k eth, 50k spce to
    await spaceCoinICO.withdraw();
    expect(await provider.getBalance(spaceCoinICO.address)).to.equal(0);
    await spaceCoin.increaseAllowance(
      spce_eth_lp.address,
      FIFTY_THOUSAND_ETHER
    );
    await spce_eth_lp.addLiquidity(
      TEN_THOUSAND_ETHER,
      FIFTY_THOUSAND_ETHER,
      ONE_THOUSAND_ETHER,
      ONE_THOUSAND_ETHER.mul(5),
      { value: TEN_THOUSAND_ETHER }
    );
    let spceReserve = await spce_eth_lp.spceReserve();
    let ethReserve = await spce_eth_lp.ethReserve();
    expect(spceReserve).to.equal(FIFTY_THOUSAND_ETHER);
    expect(ethReserve).to.equal(TEN_THOUSAND_ETHER);
    expect(await spce_eth_lp.totalSupply()).to.equal(TEN_THOUSAND_ETHER);
    expect(await spce_eth_lp.balanceOf(deployer.address)).to.equal(
      TEN_THOUSAND_ETHER
    );
    // swap 5 eth
    const ethToSwap = FIVE_ETHER;
    const bobBalanceBefore = await provider.getBalance(bob.address);
    await spce_eth_lp.connect(bob).swap(0, 0, { value: ethToSwap });
    let { amtBToTransfer, bBalanceAfter, transferFee } = getSwapValues(
      ethReserve,
      spceReserve,
      ethToSwap
    );
    expect(await provider.getBalance(bob.address)).to.be.closeTo(
      bobBalanceBefore.sub(ethToSwap),
      ROUNDING
    );
    expect(await spce_eth_lp.spceReserve()).to.equal(bBalanceAfter);
    expect(await spce_eth_lp.ethReserve()).to.equal(ethReserve.add(ethToSwap));
    // swap 1 spce
    spceReserve = await spce_eth_lp.spceReserve();
    ethReserve = await spce_eth_lp.ethReserve();
    let spceToSwap = FIVE_ETHER;
    let balanceBefore = await provider.getBalance(deployer.address);
    await spaceCoin.increaseAllowance(spce_eth_lp.address, FIVE_ETHER);
    await spce_eth_lp.swap(FIVE_ETHER, 0);
    ({ amtBToTransfer, bBalanceAfter, transferFee } = getSwapValues(
      spceReserve,
      ethReserve,
      spceToSwap
    ));
    expect(await provider.getBalance(deployer.address)).to.be.closeTo(
      balanceBefore.add(amtBToTransfer),
      ROUNDING
    );
    expect(await spce_eth_lp.spceReserve()).to.equal(
      spceReserve.add(spceToSwap)
    );
    expect(await spce_eth_lp.ethReserve()).to.equal(bBalanceAfter);
    await spce_eth_lp.getReserves();

    // add liquidity again to make sure amts are correct
    spceReserve = await spce_eth_lp.spceReserve();
    ethReserve = await spce_eth_lp.ethReserve();
    let deployerLPTokens = await spce_eth_lp.balanceOf(deployer.address);
    await spce_eth_lp.getReserves();
    const ethDesired = TEN_ETHER;
    const spceDesired = TEN_ETHER.mul(5);

    await spaceCoin.increaseAllowance(spce_eth_lp.address, spceDesired);
    await spce_eth_lp.addLiquidity(
      ethDesired,
      spceDesired,
      FIVE_ETHER,
      FIVE_ETHER.mul(5),
      { value: TEN_ETHER }
    );
    const { optimalEth, optimalSpce } = await getOptimalAmounts(
      ethDesired,
      spceDesired,
      spce_eth_lp
    );
    expect(await spce_eth_lp.spceReserve()).to.equal(
      spceReserve.add(optimalSpce)
    );
    expect(await spce_eth_lp.ethReserve()).to.equal(ethReserve.add(optimalEth));
    const tokensToMint = await getTokensToMint(
      optimalEth,
      optimalSpce,
      spce_eth_lp
    );
    expect(await spce_eth_lp.balanceOf(deployer.address)).to.equal(
      deployerLPTokens.add(tokensToMint)
    );
    await spce_eth_lp.getReserves();

    // remove liquidity
    const liquidityToRemove = FIVE_ETHER;
    spceReserve = await spce_eth_lp.spceReserve();
    ethReserve = await spce_eth_lp.ethReserve();
    deployerLPTokens = await spce_eth_lp.balanceOf(deployer.address);

    await spce_eth_lp.removeLiquidity(FIVE_ETHER, ONE_ETHER, ONE_ETHER);
    const { ethToRemove, spceToRemove } = await getEthAndSpceToRemove(
      liquidityToRemove,
      spce_eth_lp
    );
    expect(await spce_eth_lp.ethReserve()).to.equal(
      ethReserve.sub(ethToRemove)
    );
    expect(await spce_eth_lp.spceReserve()).to.equal(
      spceReserve.sub(spceToRemove)
    );
    expect(await spce_eth_lp.balanceOf(deployer.address)).to.equal(
      deployerLPTokens.sub(liquidityToRemove)
    );
  });
});
