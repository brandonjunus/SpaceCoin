//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./SpaceCoinICO.sol";

/// @title SpaceCoin
/// @author Junus
contract SpaceCoin is ERC20 {
    /// @notice If true, charge a 2% tax on all transfers
    bool public isTrasferTaxActive;

    /// @notice Standard decimal of 10**18 for display purposes only
    uint256 constant DECIMALS = 10**18;

    /// @notice Address of the treasury
    address payable immutable treasury;

    /// @notice Address of the SpaceCoinICO Contract
    SpaceCoinICO public immutable spaceCoinICO;

    /// @notice Sets the treasury address and ICO address and mints to those addresses
    /// There is a total of 500k SPCE tokens ever created. 350k should go to the treasury
    /// and 150k should go to the ICO contract.
    constructor(address _icoAddress, address _treasury)
        ERC20("SpaceCoin", "SPCE")
    {
        spaceCoinICO = SpaceCoinICO(_icoAddress);
        treasury = payable(_treasury);
        _mint(_treasury, 350000 * DECIMALS);
        _mint(_icoAddress, 150000 * DECIMALS);
    }

    /// @notice Allows the treasury to toggle the tax
    /// @param _isTaxActive Sets the transfer tax
    function setTransferTax(bool _isTaxActive) public {
        require(msg.sender == treasury, "Requires Only Owner");
        isTrasferTaxActive = _isTaxActive;
        emit transferTaxToggled(_isTaxActive);
    }

    /// @dev overrides the ERC-20 transfer function to allow for a transfer tax
    /// @param _from the address of which SPCE will be transfered from
    /// @param _to the address of which SPCE will be transfered to
    /// @param _amount the amount of SPCE to transfer
    function _transfer(
        address _from,
        address _to,
        uint256 _amount
    ) internal override {
        bool taxActive = isTrasferTaxActive;
        if (_from == treasury || _from == address(spaceCoinICO)) {
            taxActive = false;
        }
        if (taxActive) {
            uint256 tax = (_amount * 2) / 100;
            super._transfer(_from, treasury, tax);
            super._transfer(_from, _to, _amount - tax);
        } else {
            super._transfer(_from, _to, _amount);
        }
    }

    event transferTaxToggled(bool isTrasferTaxActive);
}
