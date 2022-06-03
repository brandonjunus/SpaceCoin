//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;
import "./SpaceCoin.sol";

/// @title SpaceCoinICO
/// @author Junus
contract SpaceCoinICO {
    enum ICO_PHASE {
        SEED,
        GENERAL,
        OPEN
    }
    /// @notice Total Contributed to the ICO
    uint256 public totalContributed;

    /// @notice flag for if contributions are being paused
    bool allowContributions = true;

    /// @notice Seed Phase individual contribution limit
    uint256 constant SEED_INDV_LIMIT = 1500 ether;

    /// @notice Seed Phase total contribution limit
    uint256 constant SEED_LIMIT = 15000 ether;

    /// @notice General Phase total individual contribution limit
    uint256 constant GENERAL_INDV_LIMIT = 1000 ether;

    /// @notice General/Open Phase total contribution limit
    uint256 constant GENERAL_OPEN_LIMIT = 30000 ether;

    /// @notice Current ICO Phase
    ICO_PHASE public ICOPhase = ICO_PHASE.SEED;

    /// @notice Mapping of contributor => total ETH contribution
    mapping(address => uint256) public reedeemableContributions;

    /// @notice Mapping of allowlisted users. Allowed to contribute at seed phase if true
    mapping(address => bool) public seedAllowlist;

    /// @notice Reference to SpaceCoin, the ERC-20 token
    SpaceCoin spaceCoin;

    /// @notice Address of the treasury for SpaceCoin
    address payable immutable treasury;

    modifier onlyTreasury() {
        require(msg.sender == treasury, "Requires Only Owner");
        _;
    }

    /// @notice Sets the treasury address
    constructor(address _treasury) {
        treasury = payable(_treasury);
    }

    /// @notice allows treasury to toggle contributions
    function toggleAllowContributions() public onlyTreasury {
        allowContributions = !allowContributions;
    }

    /// @notice Allows treasury to set spaceCoin address once
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

    /// @notice Allows treasury to set spaceCoin address once
    function addToAllowlist(address[] calldata _address) public onlyTreasury {
        for (uint256 i = 0; i < _address.length; i++) {
            seedAllowlist[_address[i]] = true;
            emit AllowlistedAddress(_address[i]);
        }
    }

    /// @notice Allows treasury to advance the ICO phase
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

    /// @notice allows contributors to redeem tokens in OPEN phase
    function redeemTokens() public {
        require(ICOPhase == ICO_PHASE.OPEN, "ICO not yet in open phase");
        require(
            reedeemableContributions[msg.sender] > 0,
            "No tokens to redeem"
        );
        uint256 coinsToRedeem = reedeemableContributions[msg.sender] * 5;
        reedeemableContributions[msg.sender] = 0;
        spaceCoin.transfer(msg.sender, coinsToRedeem);
        emit ReedemTokens(msg.sender, coinsToRedeem);
    }

    /// @notice allows contributions to the ICO- limitations are based on ICO phase
    function contribute() public payable {
        require(allowContributions, "Contributions Paused");
        if (ICOPhase == ICO_PHASE.SEED) {
            require(
                seedAllowlist[msg.sender] == true,
                "Investor not allowlisted"
            );
            require(
                reedeemableContributions[msg.sender] + msg.value <=
                    SEED_INDV_LIMIT,
                "Seed fund must be less than 1.5k ether"
            );
            require(
                totalContributed + msg.value <= SEED_LIMIT,
                "Seed Fund Cap Exceeded"
            );
            reedeemableContributions[msg.sender] += msg.value;
        } else if (ICOPhase == ICO_PHASE.GENERAL) {
            require(
                reedeemableContributions[msg.sender] + msg.value <=
                    GENERAL_INDV_LIMIT,
                "General Phase Contributions must be less than 1k ether"
            );
            require(
                totalContributed + msg.value <= GENERAL_OPEN_LIMIT,
                "Total General Phase Contributions must be less than 30k ether"
            );
            reedeemableContributions[msg.sender] += msg.value;
        } else if (ICOPhase == ICO_PHASE.OPEN) {
            require(
                totalContributed + msg.value <= GENERAL_OPEN_LIMIT,
                "Total Open Phase Contributions must be less than 30k ether"
            );
            uint256 coinsToRedeem = msg.value * 5;
            spaceCoin.transfer(msg.sender, coinsToRedeem);
            emit ReedemTokens(msg.sender, coinsToRedeem);
        }
        totalContributed += msg.value;
        emit Contribution(msg.sender, msg.value, ICOPhase, totalContributed);
    }

    /// @notice Allows treasury to withdraw funds contributed to the ICO
    function withdraw() public onlyTreasury returns (bool success) {
        (bool _success, bytes memory callData) = treasury.call{
            value: address(this).balance
        }("");
        require(_success, "Unsuccessful withdrawl");
        return _success;
    }

    /// @notice Emitted when tokens are redeemed
    event ReedemTokens(address indexed addr, uint256 tokens);

    /// @notice Emitted contributions are made
    event Contribution(
        address indexed addr,
        uint256 amount,
        ICO_PHASE ICOPhase,
        uint256 totalContributed
    );

    /// @notice Emitted when ICO phase is advanced
    event PhaseAdvance(ICO_PHASE ICOPhase);

    /// @notice Emitted when a user is allowlisted
    event AllowlistedAddress(address indexed addr);
}
