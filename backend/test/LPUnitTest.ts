import {
  getEthAndSpceToRemove,
  getOptimalAmounts,
  getSwapValues,
  getTokensToMint,
} from "./testingUtils";
import { SPCE_ETH_LP__factory } from "../typechain-types/factories/contracts/SPCE_ETH_LP__factory";
import { SPCE_ETH_LP } from "../typechain-types/contracts/SPCE_ETH_LP";
import { SpaceCoin__factory } from "../typechain-types/factories/contracts/SpaceCoin__factory";
import { SpaceCoinICO } from "../typechain-types/contracts/SpaceCoinICO";
import { expect } from "chai";
import { ethers } from "hardhat";
import { BigNumber } from "ethers";
import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { SpaceCoin, SpaceCoinICO__factory } from "../typechain-types";

const provider = ethers.provider;

const ROUNDING: BigNumber = ethers.utils.parseEther(".0004");
const ONE_ETHER: BigNumber = ethers.utils.parseEther("1");
const FIVE_ETHER: BigNumber = ethers.utils.parseEther("5");
const TEN_ETHER: BigNumber = ethers.utils.parseEther("10");
const FIFTY_ETHER: BigNumber = ethers.utils.parseEther("50");
const ONE_THOUSAND_ETHER: BigNumber = ethers.utils.parseEther("1000");
const FIVE_THOUSAND_ETHER: BigNumber = ethers.utils.parseEther("5000");
const TEN_THOUSAND_ETHER: BigNumber = ethers.utils.parseEther("10000");

let deployer: SignerWithAddress;
let SpaceCoinICOFactory: SpaceCoinICO__factory;
let spaceCoinICO: SpaceCoinICO;
let SpaceCoinFactory: SpaceCoin__factory;
let spaceCoin: SpaceCoin;
let SPCE_ETH_LPFactory: SPCE_ETH_LP__factory;
let spce_eth_lp: SPCE_ETH_LP;
describe("LP Router Full Workflow Test", function () {
  beforeEach(async () => {
    [deployer] = await ethers.getSigners();
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

  describe("SPC_ETH_LP - Deployment / Initialize", () => {
    it("Should deploy all contracts correctly", async () => {
      expect(spaceCoin.address).to.be.ok;
      expect(spaceCoinICO.address).to.be.ok;
      expect(spce_eth_lp.address).to.be.ok;
    });
    it("Is initallized with symbol and name correctly", async () => {
      expect(await spce_eth_lp.name()).to.equal("SPCE_ETH_LP");
      expect(await spce_eth_lp.symbol()).to.equal("SPCE_ETH");
    });
    it("Is initallized with 0 SPCE and ETH reserves", async () => {
      expect(await spce_eth_lp.spceReserve()).to.equal(0);
      expect(await spce_eth_lp.ethReserve()).to.equal(0);
    });
  });
  describe("Add Liquidity", () => {
    beforeEach(async () => {
      await spaceCoin.increaseAllowance(
        spce_eth_lp.address,
        FIVE_THOUSAND_ETHER
      );
      await spce_eth_lp.addLiquidity(
        ONE_THOUSAND_ETHER,
        FIVE_THOUSAND_ETHER,
        ONE_THOUSAND_ETHER,
        FIVE_THOUSAND_ETHER,
        { value: ONE_THOUSAND_ETHER }
      );
    });
    it("Should properly add liquidity if 0 in reserve", async () => {
      const { spceReserve, ethReserve, totalSupply, balanceOf } = spce_eth_lp;
      expect(await ethReserve()).to.equal(ONE_THOUSAND_ETHER);
      expect(await spceReserve()).to.equal(FIVE_THOUSAND_ETHER);
      expect(await totalSupply()).to.equal(ONE_THOUSAND_ETHER);
      expect(await balanceOf(deployer.address)).to.equal(ONE_THOUSAND_ETHER);
    });
    it("Should add optimal amounts if reserves are non 0", async () => {
      const ethDesired = ONE_ETHER.div(100);
      const spceDesired = ONE_ETHER.div(100).mul(5);
      const spceReserve = await spce_eth_lp.spceReserve();
      const ethReserve = await spce_eth_lp.ethReserve();
      const deployerLPTokens = await spce_eth_lp.balanceOf(deployer.address);
      await spaceCoin.increaseAllowance(spce_eth_lp.address, spceDesired);
      await spce_eth_lp.addLiquidity(ethDesired, spceDesired, 0, 0, {
        value: ethDesired,
      });
      console.log("ethDesired", ethDesired);
      console.log("spceDesired", spceDesired);
      const { optimalEth, optimalSpce } = await getOptimalAmounts(
        ethDesired,
        spceDesired,
        spce_eth_lp
      );
      // dont wanna hardcode an actual unit test here but commenting for future:
      // optimal eth should be  : .2 eth
      // optimal spce should be :  1 eth
      expect(await spce_eth_lp.spceReserve()).to.equal(
        spceReserve.add(optimalSpce)
      );
      expect(await spce_eth_lp.ethReserve()).to.equal(
        ethReserve.add(optimalEth)
      );
      const tokensToMint = await getTokensToMint(
        optimalEth,
        optimalSpce,
        spce_eth_lp
      );
      expect(await spce_eth_lp.balanceOf(deployer.address)).to.equal(
        deployerLPTokens.add(tokensToMint)
      );
    });
    it("Should revert if not enough ETH is provided", async () => {
      const ethDesired = ONE_THOUSAND_ETHER;
      const spceDesired = FIVE_THOUSAND_ETHER;
      await spaceCoin.increaseAllowance(spce_eth_lp.address, spceDesired);
      await expect(
        spce_eth_lp.addLiquidity(ethDesired, spceDesired, 0, 0, {
          value: ethDesired.div(5),
        })
      ).to.be.revertedWith("addLiquidity: not enough eth contributed");
    });
    it("Should revert if optimal ETH is less than min ETH desired", async () => {
      const ethDesired = ONE_THOUSAND_ETHER;
      const spceDesired = ONE_THOUSAND_ETHER;
      await spaceCoin.increaseAllowance(spce_eth_lp.address, spceDesired);
      await expect(
        spce_eth_lp.addLiquidity(
          ethDesired,
          spceDesired,
          ethDesired,
          spceDesired,
          { value: ethDesired }
        )
      ).to.be.revertedWith("getOptimalAmounts: Insufficent ETH");
    });
    it("Should revert if optimal SPCE is less than min SPCE desired", async () => {
      const ethDesired = ONE_THOUSAND_ETHER;
      const spceDesired = TEN_THOUSAND_ETHER;
      await spaceCoin.increaseAllowance(spce_eth_lp.address, spceDesired);
      await expect(
        spce_eth_lp.addLiquidity(
          ethDesired,
          spceDesired,
          ethDesired,
          spceDesired.mul(2),
          { value: ethDesired }
        )
      ).to.be.revertedWith("getOptimalAmounts: Insufficent SPCE");
    });
    it("Should return extra ETH provided if it is over optimal ETH", async () => {
      const ethDesired = ONE_THOUSAND_ETHER;
      const spceDesired = ONE_THOUSAND_ETHER;
      const deployerBalanceBefore = await provider.getBalance(deployer.address);
      await spaceCoin.increaseAllowance(spce_eth_lp.address, spceDesired);
      await spce_eth_lp.addLiquidity(ethDesired, spceDesired, 1, spceDesired, {
        value: ethDesired,
      });
      const { optimalEth, optimalSpce } = await getOptimalAmounts(
        ethDesired,
        spceDesired,
        spce_eth_lp
      );
      // optimal eth for adding liquidity in this situation is ethDesired.div(5)
      expect(optimalEth).to.equal(ethDesired.div(5));
      // the LP should return the remaining 8 eth that was provided
      // this means the liquidity provider should only have spent 2 eth
      expect(await provider.getBalance(deployer.address)).to.be.closeTo(
        deployerBalanceBefore.sub(optimalEth),
        ROUNDING
      );
    });
    it("Should return extra ETH provided if it is over optimal ETH", async () => {
      const ethDesired = ONE_THOUSAND_ETHER;
      const spceDesired = FIVE_THOUSAND_ETHER;
      await spaceCoin.increaseAllowance(spce_eth_lp.address, spceDesired);
      const { optimalEth, optimalSpce } = await getOptimalAmounts(
        ethDesired,
        spceDesired,
        spce_eth_lp
      );
      const tokensToMint = await getTokensToMint(
        optimalEth,
        optimalSpce,
        spce_eth_lp
      );
      await expect(
        spce_eth_lp.addLiquidity(ethDesired, spceDesired, 1, spceDesired, {
          value: ethDesired,
        })
      )
        .to.emit(spce_eth_lp, "AddLiquidityEvent")
        .withArgs(ethDesired, spceDesired, tokensToMint, deployer.address);
    });
  });
  describe("Swap", () => {
    beforeEach(async () => {
      const eth = TEN_ETHER;
      const spce = FIFTY_ETHER;
      await spaceCoin.increaseAllowance(spce_eth_lp.address, spce);
      await spce_eth_lp.addLiquidity(eth, spce, eth, spce, { value: eth });
    });
    it("Should properly calculate swaps", async () => {
      // swap 1 spce
      const spceToSwap = ONE_ETHER;
      let deployerSpceBalanceBefore = await spaceCoin.balanceOf(
        deployer.address
      );
      let spceBalanceBefore = await spaceCoin.balanceOf(spce_eth_lp.address);
      let deployerEthBalanceBefore = await provider.getBalance(
        deployer.address
      );
      let spceReserve = await spce_eth_lp.spceReserve();
      let ethReserve = await spce_eth_lp.ethReserve();
      await spaceCoin.increaseAllowance(spce_eth_lp.address, spceToSwap);
      let { amtBToTransfer, bBalanceAfter, transferFee } = getSwapValues(
        spceReserve,
        ethReserve,
        spceToSwap
      );
      await expect(spce_eth_lp.swap(spceToSwap, 0))
        .to.emit(spce_eth_lp, "SwapEvent")
        .withArgs(
          amtBToTransfer, // eth to swap
          spceToSwap,
          false, // is eth transfer
          deployer.address
        );
      expect(await provider.getBalance(deployer.address)).to.be.closeTo(
        deployerEthBalanceBefore.add(amtBToTransfer),
        ROUNDING
      );
      expect(await spce_eth_lp.spceReserve()).to.equal(
        spceReserve.add(spceToSwap)
      );
      expect(await spce_eth_lp.ethReserve()).to.equal(bBalanceAfter);
      expect(await provider.getBalance(spce_eth_lp.address)).to.equal(
        bBalanceAfter
      );
      expect(await spaceCoin.balanceOf(deployer.address)).to.equal(
        deployerSpceBalanceBefore.sub(spceToSwap)
      );
      expect(await spaceCoin.balanceOf(spce_eth_lp.address)).to.equal(
        spceBalanceBefore.add(spceToSwap)
      );

      // swap 1 eth
      const ethToSwap = ONE_ETHER;
      spceReserve = await spce_eth_lp.spceReserve();
      ethReserve = await spce_eth_lp.ethReserve();
      spceBalanceBefore = await spaceCoin.balanceOf(spce_eth_lp.address);
      const ethBalanceBefore = await provider.getBalance(spce_eth_lp.address);
      spceReserve = await spce_eth_lp.spceReserve();
      ethReserve = await spce_eth_lp.ethReserve();
      deployerSpceBalanceBefore = await spaceCoin.balanceOf(deployer.address);
      deployerEthBalanceBefore = await provider.getBalance(deployer.address);
      ({ amtBToTransfer, bBalanceAfter, transferFee } = getSwapValues(
        ethReserve,
        spceReserve,
        ethToSwap
      ));
      await expect(spce_eth_lp.swap(0, 0, { value: ethToSwap }))
        .to.emit(spce_eth_lp, "SwapEvent")
        .withArgs(
          ethToSwap,
          amtBToTransfer,
          true, // is eth transfer
          deployer.address
        );
      expect(await provider.getBalance(deployer.address)).to.be.closeTo(
        deployerEthBalanceBefore.sub(ethToSwap),
        ROUNDING
      );
      expect(await spce_eth_lp.spceReserve()).to.equal(
        spceReserve.sub(amtBToTransfer)
      );
      expect(await spce_eth_lp.ethReserve()).to.equal(
        ethReserve.add(ethToSwap)
      );
      expect(await provider.getBalance(spce_eth_lp.address)).to.equal(
        ethBalanceBefore.add(ethToSwap)
      );
      expect(await spaceCoin.balanceOf(deployer.address)).to.equal(
        deployerSpceBalanceBefore.add(amtBToTransfer)
      );
      expect(await spaceCoin.balanceOf(spce_eth_lp.address)).to.equal(
        spceBalanceBefore.sub(amtBToTransfer)
      );
    });
    it("Should revert if eth and spce given are both 0", async () => {
      const spceAndEthToSwap = 0;
      await expect(
        spce_eth_lp.swap(spceAndEthToSwap, 0, { value: spceAndEthToSwap })
      ).to.be.revertedWith("swap: Must send in either ETH or SPCE");
    });
    it("Should revert if eth and spce given are both > 0", async () => {
      const spceAndEthToSwap = ONE_ETHER;
      await expect(
        spce_eth_lp.swap(spceAndEthToSwap, 0, { value: spceAndEthToSwap })
      ).to.be.revertedWith("swap: Eth swap, but spce was included");
    });
    it("Should revert if eth to reiceve > min acceptable amount", async () => {
      const spceToSwap = ONE_ETHER;
      await expect(spce_eth_lp.swap(spceToSwap, ONE_ETHER)).to.be.revertedWith(
        "swap: ETH amt to recieve > minReturn"
      );
    });
    it("Should revert if eth to reiceve > min acceptable amount", async () => {
      const ethToSwap = ONE_ETHER;
      await expect(
        spce_eth_lp.swap(0, FIVE_ETHER, { value: ethToSwap })
      ).to.be.revertedWith("swap: SPCE amt to recieve > minReturn");
    });
  });
  describe("Remove Liquidity", () => {
    beforeEach(async () => {
      const eth = TEN_ETHER;
      const spce = FIFTY_ETHER;
      await spaceCoin.increaseAllowance(spce_eth_lp.address, spce);
      await spce_eth_lp.addLiquidity(eth, spce, eth, spce, { value: eth });
    });
    it("Should properly remove liquidity", async () => {
      const liquidityToRemove = FIVE_ETHER;
      const spceReserve = await spce_eth_lp.spceReserve();
      const ethReserve = await spce_eth_lp.ethReserve();
      const deployerLPTokens = await spce_eth_lp.balanceOf(deployer.address);
      const deployerSpceBalance = await spaceCoin.balanceOf(deployer.address);
      const deployerBalance = await provider.getBalance(deployer.address);

      const { ethToRemove, spceToRemove } = await getEthAndSpceToRemove(
        liquidityToRemove,
        spce_eth_lp
      );

      await expect(
        spce_eth_lp.removeLiquidity(FIVE_ETHER, ONE_ETHER, ONE_ETHER)
      )
        .to.emit(spce_eth_lp, "RemoveLiquidityEvent")
        .withArgs(
          ethToRemove,
          spceToRemove,
          liquidityToRemove,
          deployer.address
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
      expect(await spce_eth_lp.balanceOf(deployer.address)).to.equal(
        deployerLPTokens.sub(liquidityToRemove)
      );
      expect(await spaceCoin.balanceOf(deployer.address)).to.equal(
        deployerSpceBalance.add(spceToRemove)
      );
      expect(await provider.getBalance(deployer.address)).to.be.closeTo(
        deployerBalance.add(ethToRemove),
        ROUNDING
      );
    });
    it("Should revert trying to redeem too many tokens", async () => {
      const deployerSpceBalance = await spce_eth_lp.balanceOf(deployer.address);
      await expect(
        spce_eth_lp.removeLiquidity(
          deployerSpceBalance.add(ONE_ETHER),
          ONE_ETHER,
          ONE_ETHER
        )
      ).to.be.revertedWith("removeLiquidity: Trying to redeem too many tokens");
    });
    it("Should revert tokens provide less liquidity than min eth", async () => {
      const liquidityToRemove = FIVE_ETHER;
      const { ethToRemove } = await getEthAndSpceToRemove(
        liquidityToRemove,
        spce_eth_lp
      );
      await expect(
        spce_eth_lp.removeLiquidity(
          ethToRemove,
          ethToRemove.add(ONE_ETHER),
          ONE_ETHER
        )
      ).to.be.revertedWith("removeLiquidity: Removing below min eth");
    });
    it("Should revert tokens provide less liquidity than min spce", async () => {
      const liquidityToRemove = FIVE_ETHER;
      const { ethToRemove, spceToRemove } = await getEthAndSpceToRemove(
        liquidityToRemove,
        spce_eth_lp
      );
      await expect(
        spce_eth_lp.removeLiquidity(
          ethToRemove,
          ONE_ETHER,
          spceToRemove.add(ONE_ETHER)
        )
      ).to.be.revertedWith("removeLiquidity: Removing below min spce");
    });
  });
});
