import { SpaceCoin__factory } from "./../typechain-types/factories/contracts/SpaceCoin__factory";
import { SpaceCoinICO } from "./../typechain-types/contracts/SpaceCoinICO";
import { expect } from "chai";
import { ethers } from "hardhat";
import { BigNumber } from "ethers";
import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { SpaceCoin, SpaceCoinICO__factory } from "../typechain-types";

const ICOPhases = {
  GENERAL: 1,
  OPEN: 2,
};
const { GENERAL, OPEN } = ICOPhases;

const ONE_ETHER: BigNumber = ethers.utils.parseEther("1");
const ONE_THOUSAND_ETHER: BigNumber = ethers.utils.parseEther("1000");
const FIVE_HUNDRED_ETHER: BigNumber = ethers.utils.parseEther("500");
const ONE_THOUSAND_FIVE_HUNDRED_ETHER: BigNumber =
  ethers.utils.parseEther("1500");
const THREE_THOUSAND_ETHER: BigNumber = ethers.utils.parseEther("3000");

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

describe("SpaceCoin", function () {
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
  });

  describe("SpaceCoin Token Contract", () => {
    it("Is named SpaceCoin", async () => {
      expect(await spaceCoin.name()).to.equal("SpaceCoin");
    });
    it("Has a token symbol of SPCE", async () => {
      expect(await spaceCoin.symbol()).to.equal("SPCE");
    });
    it("Has a total supply of 500,000", async () => {
      expect(await spaceCoin.totalSupply()).to.equal(
        ethers.utils.parseEther("500000")
      );
    });
    it("Has 150,000 allocated to the ICO contract", async () => {
      expect(await spaceCoin.balanceOf(spaceCoinICO.address)).to.equal(
        ethers.utils.parseEther("150000")
      );
    });
    it("Has 300,000 allocated to the treasury", async () => {
      expect(await spaceCoin.balanceOf(deployer.address)).to.equal(
        ethers.utils.parseEther("350000")
      );
    });
    it("Allows owner to toggle transfer tax", async () => {
      await spaceCoin.toggleTax();
      expect(await spaceCoin.isTrasferTaxActive()).to.equal(true);
    });
    it("Doesn't allow non-owners to toggle tax", async () => {
      await expect(spaceCoin.connect(bob).toggleTax()).to.be.revertedWith(
        "Requires Only Owner"
      );
    });
    it("Charges 2% tax on transfers when tax is active", async () => {
      await spaceCoinICO.advanceICOPhase(GENERAL);
      await spaceCoinICO.connect(bob).contribute({ value: ONE_ETHER });
      await spaceCoinICO.advanceICOPhase(OPEN);
      await spaceCoinICO.connect(bob).redeemTokens();
      await spaceCoin.toggleTax();
      await spaceCoin.connect(bob).approve(alice.address, ONE_ETHER.mul(5));
      await spaceCoin
        .connect(alice)
        .transferFrom(bob.address, alice.address, ONE_ETHER.mul(5));
      const taxAmt = ONE_ETHER.mul(5).mul(2).div(100);
      expect(await spaceCoin.balanceOf(bob.address)).to.equal(0);
      expect(await spaceCoin.balanceOf(alice.address)).to.equal(
        ONE_ETHER.mul(5).sub(taxAmt)
      );
    });
    it("Charges no tax when tax is not active", async () => {
      await spaceCoinICO.advanceICOPhase(GENERAL);
      await spaceCoinICO.connect(bob).contribute({ value: ONE_ETHER });
      await spaceCoinICO.advanceICOPhase(OPEN);
      await spaceCoinICO.connect(bob).redeemTokens();
      await spaceCoin.connect(bob).approve(alice.address, ONE_ETHER.mul(5));
      await spaceCoin
        .connect(alice)
        .transferFrom(bob.address, alice.address, ONE_ETHER.mul(5));
      expect(await spaceCoin.balanceOf(bob.address)).to.equal(0);
      expect(await spaceCoin.balanceOf(alice.address)).to.equal(
        ONE_ETHER.mul(5)
      );
    });
  });
  describe("SpaceCoin ICO", () => {
    describe("Deployment", () => {
      it("To deploy succesfully", async () => {
        expect(spaceCoinICO.address).to.be.ok;
      });
      it("Allows setting Space Coin Address only once", async () => {
        await expect(
          spaceCoinICO.setSpaceCoinAddress(spaceCoin.address)
        ).to.be.revertedWith("SpaceCoin Contract Already Set");
      });
    });
    describe("General", () => {
      it("Allows owner to advance phase", async () => {
        expect(await spaceCoinICO.ICOPhase()).to.equal(0);
        await spaceCoinICO.advanceICOPhase(GENERAL);
        expect(await spaceCoinICO.ICOPhase()).to.equal(1);
        await spaceCoinICO.advanceICOPhase(OPEN);
        expect(await spaceCoinICO.ICOPhase()).to.equal(2);
      });
      it("Prevents non-owners from advancing phase", async () => {
        await expect(
          spaceCoinICO.connect(bob).advanceICOPhase(GENERAL)
        ).to.be.revertedWith("Requires Only Owner");
      });
      it("Emits a Phase Advance event", async () => {
        await expect(spaceCoinICO.advanceICOPhase(GENERAL)).to.emit(
          spaceCoinICO,
          "PhaseAdvance"
        );
      });
      it("Pause funding at any time", async () => {
        await spaceCoinICO.addToWhitelist([alice.address]);
        await spaceCoinICO.connect(alice).contribute({ value: ONE_ETHER });
        await spaceCoinICO.toggleAllowContributions();
        await expect(
          spaceCoinICO.connect(alice).contribute({ value: ONE_ETHER })
        ).to.be.revertedWith("Contributions Paused");
      });
      it("Allows Owners to add Seed Investors to the whitelist", async () => {
        await spaceCoinICO.addToWhitelist([bob.address]);
        expect(await spaceCoinICO.seedWhitelist(bob.address)).to.equal(true);
        expect(await spaceCoinICO.seedWhitelist(alice.address)).to.equal(false);
      });
      it("Prevents non-owners to add Seed Investors to the whitelist", async () => {
        await expect(
          spaceCoinICO.connect(bob).addToWhitelist([bob.address])
        ).to.be.revertedWith("Requires Only Owner");
      });
      it("Prevents token redemptions before phase is OPEN", async () => {
        await spaceCoinICO.addToWhitelist([bob.address]);
        await spaceCoinICO.connect(bob).contribute({ value: ONE_ETHER });
        await expect(
          spaceCoinICO.connect(bob).redeemTokens()
        ).to.be.revertedWith("ICO not yet in open phase");
        await spaceCoinICO.advanceICOPhase(GENERAL);
        await expect(
          spaceCoinICO.connect(bob).redeemTokens()
        ).to.be.revertedWith("ICO not yet in open phase");
        await spaceCoinICO.advanceICOPhase(OPEN);
        await spaceCoinICO.connect(bob).redeemTokens();
        expect(
          await spaceCoinICO.reedeemableContributions(bob.address)
        ).to.equal(0);
        expect(await spaceCoin.balanceOf(bob.address)).to.equal(
          ONE_ETHER.mul(5)
        );
      });
      it("Contributions emit a event", async () => {
        await spaceCoinICO.addToWhitelist([alice.address]);
        await expect(
          spaceCoinICO.connect(alice).contribute({ value: ONE_ETHER })
        )
          .to.emit(spaceCoinICO, "Contribution")
          .withArgs(alice.address, ONE_ETHER, 0, ONE_ETHER);
        await spaceCoinICO.advanceICOPhase(GENERAL);
        await expect(
          spaceCoinICO.connect(alice).contribute({ value: ONE_ETHER })
        )
          .to.emit(spaceCoinICO, "Contribution")
          .withArgs(alice.address, ONE_ETHER, 1, ONE_ETHER.add(ONE_ETHER));
        await spaceCoinICO.advanceICOPhase(OPEN);
        await expect(
          spaceCoinICO.connect(alice).contribute({ value: ONE_ETHER })
        )
          .to.emit(spaceCoinICO, "Contribution")
          .withArgs(
            alice.address,
            ONE_ETHER,
            2,
            ONE_ETHER.add(ONE_ETHER).add(ONE_ETHER)
          );
      });
    });
    describe("ICO Phases", () => {
      describe("Seed Phase", () => {
        it("Allows contributions from whitelisted investors", async () => {
          await spaceCoinICO.addToWhitelist([bob.address]);
          spaceCoinICO.connect(bob).contribute({ value: ONE_ETHER });
        });
        it("Blocks contributions above individual limit (1.5k ether)", async () => {
          await spaceCoinICO.addToWhitelist([bob.address]);
          await spaceCoinICO
            .connect(bob)
            .contribute({ value: ONE_THOUSAND_ETHER });
          await expect(
            spaceCoinICO.connect(bob).contribute({ value: ONE_THOUSAND_ETHER })
          ).to.be.revertedWith("Seed fund must be less than 1.5k ether");
          await spaceCoinICO
            .connect(bob)
            .contribute({ value: FIVE_HUNDRED_ETHER });
        });
        it("Blocks contributions above round limit (15k ether)", async () => {
          const bobs = [
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
          ];
          await Promise.all(
            bobs.map(async (bob) => {
              await spaceCoinICO.addToWhitelist([bob.address]);
            })
          );
          await Promise.all(
            bobs.map(async (bob) => {
              await spaceCoinICO
                .connect(bob)
                .contribute({ value: ONE_THOUSAND_FIVE_HUNDRED_ETHER });
            })
          );
          await spaceCoinICO.addToWhitelist([alice.address]);
          await expect(
            spaceCoinICO.connect(alice).contribute({ value: ONE_ETHER })
          ).to.be.revertedWith("Seed Fund Cap Exceeded");
        });
        it("Blocks contributions when not whitelisted", async () => {
          await expect(
            spaceCoinICO.connect(alice).contribute({ value: ONE_ETHER })
          ).to.be.revertedWith("Investor not whitelisted");
        });
      });
      describe("General Phase", () => {
        it("Allows contributions from non-whitelisted investors", async () => {
          await spaceCoinICO.advanceICOPhase(GENERAL);
          await spaceCoinICO.connect(bob).contribute({ value: ONE_ETHER });
          expect(
            await spaceCoinICO.reedeemableContributions(bob.address)
          ).to.equal(ONE_ETHER);
        });
        it("Blocks contributions from seed investors over the general individual cap (1k ether)", async () => {
          await spaceCoinICO.addToWhitelist([bob.address]);
          await spaceCoinICO
            .connect(bob)
            .contribute({ value: ONE_THOUSAND_ETHER });
          await spaceCoinICO.advanceICOPhase(GENERAL);
          await expect(
            spaceCoinICO.connect(bob).contribute({ value: ONE_ETHER })
          ).to.be.revertedWith(
            "General Phase Contributions must be less than 1k ether"
          );
        });
        it("Blocks contributions above general individual cap", async () => {
          await spaceCoinICO.advanceICOPhase(GENERAL);
          await spaceCoinICO
            .connect(bob)
            .contribute({ value: ONE_THOUSAND_ETHER });
          await expect(
            spaceCoinICO.connect(bob).contribute({ value: ONE_ETHER })
          ).to.be.revertedWith(
            "General Phase Contributions must be less than 1k ether"
          );
        });
        it.skip("Blocks contributions above the general cap (30k ether)", async () => {
          // todo: how am i supposed to test this lol
        });
      });
      describe("Open Phase", () => {
        it("Allows token redempetions from token and seed phase", async () => {
          await spaceCoinICO.addToWhitelist([bob.address]);
          await spaceCoinICO.connect(bob).contribute({ value: ONE_ETHER });
          await spaceCoinICO.advanceICOPhase(GENERAL);
          await spaceCoinICO.connect(bob).contribute({ value: ONE_ETHER });
          await spaceCoinICO.advanceICOPhase(OPEN);
          await spaceCoinICO.connect(bob).redeemTokens();
          expect(await spaceCoin.balanceOf(bob.address)).to.equal(
            ONE_ETHER.add(ONE_ETHER).mul(5)
          );
          expect(
            await spaceCoinICO.reedeemableContributions(bob.address)
          ).to.equal(0);
        });
        it("Automatically reedems open phase contribution for tokens", async () => {
          await spaceCoinICO.advanceICOPhase(GENERAL);
          await spaceCoinICO.advanceICOPhase(OPEN);
          await spaceCoinICO.connect(bob).contribute({ value: ONE_ETHER });
          expect(await spaceCoin.balanceOf(bob.address)).to.equal(
            ONE_ETHER.mul(5)
          );
          expect(
            await spaceCoinICO.reedeemableContributions(bob.address)
          ).to.equal(0);
        });
        it("Blocks contributions above open cap (30k)", async () => {
          const bobs = [
            bob,
            bob1,
            bob2,
            bob3,
            bob4,
            bob5,
            bob7,
            bob8,
            bob9,
            bob10,
          ];
          await spaceCoinICO.advanceICOPhase(GENERAL);
          await spaceCoinICO.advanceICOPhase(OPEN);
          await Promise.all(
            bobs.map(async (bob) => {
              await spaceCoinICO
                .connect(bob)
                .contribute({ value: THREE_THOUSAND_ETHER });
            })
          );
          expect(await spaceCoinICO.totalContributed()).to.equal(
            THREE_THOUSAND_ETHER.mul(10)
          );
          await expect(
            spaceCoinICO.connect(alice).contribute({ value: ONE_ETHER })
          ).to.be.revertedWith(
            "Total Open Phase Contributions must be less than 30k ether"
          );
        });
        it("Blocks contributions when not whitelisted", async () => {
          await expect(
            spaceCoinICO.connect(alice).contribute({ value: ONE_ETHER })
          ).to.be.revertedWith("Investor not whitelisted");
        });
      });
    });
  });
});

// console.log("what", what);
