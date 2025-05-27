// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TestUSDC is ERC20, ERC20Permit, Ownable {
    constructor(address initialOwner)
        ERC20("Test USD Coin", "TestUSDC")
        ERC20Permit("Test USD Coin")
        Ownable(initialOwner) // ✅ Gerekli parametre
    {
        _mint(initialOwner, 1_000_000 * 10 ** decimals());
    }

    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
}









