//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;
import "./SpaceCoin.sol";

contract SpaceCoinICO {
    enum ICO_PHASE {
        SEED,
        GENERAL,
        OPEN
    }
    uint256 constant seedCap = 15000 ether;
    uint256 constant seedIndviCap = 1500 ether;
    uint256 constant generalAndOpenCap = 30000 ether;
    uint256 constant generalIndviCap = 1000 ether;

    ICO_PHASE public ICOPhase = ICO_PHASE.SEED;
    bool allowContributions = true;
    uint256 public totalContributed;
    // whitelisted Address => contributions
    mapping(address => uint256) public reedeemableContributions;
    // whitelisted Address => is Whitelisted
    mapping(address => bool) public seedWhitelist;

    SpaceCoin spaceCoin;
    address payable immutable treasury;
    modifier onlyTreasury() {
        require(msg.sender == treasury, "Requires Only Owner");
        _;
    }

    constructor(address _treasury) {
        treasury = payable(_treasury);
    }

    function toggleAllowContributions() public onlyTreasury {
        allowContributions = !allowContributions;
    }

    function setSpaceCoinAddress(address _spaceCoinAddress)
        public
        onlyTreasury
    {
        require(
            address(spaceCoin) == address(0),
            "SpaceCoin Contract Already Set"
        );
        spaceCoin = SpaceCoin(_spaceCoinAddress);
    }

    function addToWhitelist(address[] calldata _whitelistedAddress)
        public
        onlyTreasury
    {
        for (uint256 i = 0; i < _whitelistedAddress.length; i++) {
            seedWhitelist[_whitelistedAddress[i]] = true;
            emit WhitelistedAddress(_whitelistedAddress[i]);
        }
    }

    function advanceICOPhase(ICO_PHASE phase) public onlyTreasury {
        require(ICOPhase != ICO_PHASE.OPEN, "Already Phase Open");
        if (ICOPhase == ICO_PHASE.SEED) {
            require(phase == ICO_PHASE.GENERAL, "Incorret Phase Advance");
            ICOPhase = ICO_PHASE.GENERAL;
        } else if (ICOPhase == ICO_PHASE.GENERAL) {
            require(phase == ICO_PHASE.OPEN, "Incorret Phase Advance");
            ICOPhase = ICO_PHASE.OPEN;
        }
        emit PhaseAdvance(ICOPhase);
    }

    function redeemTokens() public {
        require(ICOPhase == ICO_PHASE.OPEN, "ICO not yet in open phase");
        require(
            reedeemableContributions[msg.sender] > 0,
            "No tokens to redeem"
        );
        uint256 coinsToRedeem = reedeemableContributions[msg.sender] * 5;
        reedeemableContributions[msg.sender] = 0;

        // spaceCoin.transferFrom(msg.sender)
        spaceCoin.transfer(msg.sender, coinsToRedeem);
        emit ReedemTokens(msg.sender, coinsToRedeem);
    }

    function transferToLP(address lpProvider) private {}

    function seedContribution() private {
        require(seedWhitelist[msg.sender] == true, "Investor not whitelisted");
        require(
            reedeemableContributions[msg.sender] + msg.value <= seedIndviCap,
            "Seed fund must be less than 1.5k ether"
        );
        require(
            totalContributed + msg.value <= seedCap,
            "Seed Fund Cap Exceeded"
        );
        reedeemableContributions[msg.sender] += msg.value;
    }

    function generalContribution() private {
        require(
            reedeemableContributions[msg.sender] + msg.value <= generalIndviCap,
            "General Phase Contributions must be less than 1k ether"
        );
        require(
            totalContributed + msg.value <= generalAndOpenCap,
            "Total General Phase Contributions must be less than 30k ether"
        );
        reedeemableContributions[msg.sender] += msg.value;
    }

    function openContribution() private {
        require(
            totalContributed + msg.value <= generalAndOpenCap,
            "Total Open Phase Contributions must be less than 30k ether"
        );
        uint256 coinsToRedeem = msg.value * 5;
        spaceCoin.transfer(msg.sender, coinsToRedeem);
        emit ReedemTokens(msg.sender, coinsToRedeem);
    }

    function contribute() public payable {
        require(allowContributions, "Contributions Paused");
        if (ICOPhase == ICO_PHASE.SEED) {
            seedContribution();
        } else if (ICOPhase == ICO_PHASE.GENERAL) {
            generalContribution();
        } else if (ICOPhase == ICO_PHASE.OPEN) {
            openContribution();
        }
        totalContributed += msg.value;
        emit Contribution(msg.sender, msg.value, ICOPhase, totalContributed);
    }

    function withdraw() public onlyTreasury returns (bool success) {
        (bool success, bytes memory callData) = treasury.call{
            value: address(this).balance
        }("");
        require(success, "Unsuccessful withdrawl");
        return success;
    }

    event ReedemTokens(address indexed addr, uint256 tokens);
    event Contribution(
        address indexed addr,
        uint256 amount,
        ICO_PHASE ICOPhase,
        uint256 totalContributed
    );
    event PhaseAdvance(ICO_PHASE ICOPhase);
    event WhitelistedAddress(address indexed addr);
}
