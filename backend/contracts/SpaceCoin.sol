//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./SpaceCoinICO.sol";

contract SpaceCoin is ERC20 {
    uint256 constant decimalMulitiplier = 10**18;
    bool public isTrasferTaxActive;
    address payable immutable treasury;
    SpaceCoinICO public immutable spaceCoinICO;

    constructor(address ICOAddress, address _treasury)
        ERC20("SpaceCoin", "SPCE")
    {
        spaceCoinICO = SpaceCoinICO(ICOAddress);
        treasury = payable(_treasury);
        // 500,000 total supply
        // 350,000 treasury supply
        _mint(_treasury, 350000 * decimalMulitiplier);
        // 150,000 to ICO
        _mint(ICOAddress, 150000 * decimalMulitiplier);
    }

    function toggleTax() public {
        require(msg.sender == treasury, "Requires Only Owner");
        isTrasferTaxActive = !isTrasferTaxActive;
    }

    // overrides ERC20 _transfer to include tax
    function _transfer(
        address from,
        address to,
        uint256 amount
    ) internal override {
        bool taxActive = (from != treasury || from != address(spaceCoinICO)) &&
            isTrasferTaxActive;
        if (taxActive) {
            uint256 tax = (amount * 2) / 100;
            super._transfer(from, treasury, tax);
            super._transfer(from, to, amount - tax);
        } else {
            super._transfer(from, to, amount);
        }
    }
}
