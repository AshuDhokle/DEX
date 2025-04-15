// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';

contract LPToken is ERC20 {
    constructor() ERC20("LPToken", "LPT"){}

    function mintLP(uint256 _amount, address _caller) external payable {
        _mint(_caller, _amount);
    }

    function burnLP(uint256 _amount, address _caller) external payable {
        _burn(_caller, _amount);
    }
}
