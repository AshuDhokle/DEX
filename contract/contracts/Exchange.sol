// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;
import "@openzeppelin/contracts/access/Ownable.sol";
import './AntToken.sol';
import './LPToken.sol';

contract Exchange is Ownable{
    
    Ant antToken;
    LPToken lpToken;

    constructor (address _lpTokenAddress, address _antTokenAddress) Ownable(msg.sender){
        antToken = Ant(_antTokenAddress);
        lpToken = LPToken(_lpTokenAddress);
    }

    function getReserve() public view returns(uint256) {
        return antToken.balanceOf(address(this));
    }

    function addLiquidity (uint256 _amountOfToken) external payable returns(uint256) {
        uint256 lpTokensToMint;
        uint256 ethReserveBalance = address(this).balance;
        uint256 antTokenBalance = getReserve();

        if(antTokenBalance == 0) {
           antToken.transferFrom(msg.sender, address(this), _amountOfToken);
           lpTokensToMint = ethReserveBalance;
           lpToken.mintLP(lpTokensToMint, msg.sender); 
           return lpTokensToMint;
        } 

        uint256 ethReservePriorToFunctionCall = ethReserveBalance - msg.value;
        uint256 minTokenAmountRequired = (msg.value * antTokenBalance) / (msg.value + ethReservePriorToFunctionCall);

        require(_amountOfToken >= minTokenAmountRequired, "Insufficient amount of tokens provided");

        antToken.transferFrom(msg.sender, address(this), minTokenAmountRequired);

        lpTokensToMint = (lpToken.totalSupply() * msg.value) / ethReservePriorToFunctionCall;

        lpToken.mintLP(lpTokensToMint, msg.sender);

        return lpTokensToMint;
    }
    
    function removeLiquidity(uint256 _amountOfLPToken) external returns(uint256, uint256) {
        require(_amountOfLPToken > 0, "Not enough Tokens");

        uint256 ethReserveBalance = address(this).balance;
        uint256 lpTokenTotalSupply = lpToken.totalSupply();

        uint256 ethToReturn = (ethReserveBalance * _amountOfLPToken) / lpTokenTotalSupply;
        uint256 antTokenToReturn = (getReserve() * _amountOfLPToken) / lpTokenTotalSupply;

        lpToken.burnLP(_amountOfLPToken, msg.sender);

        payable(msg.sender).transfer(ethToReturn);
        antToken.transfer(msg.sender, antTokenToReturn);

        return (ethToReturn, antTokenToReturn);
    }

    function calculateSwap(
        uint256 inputAmount,
        uint256 inputReserve,
        uint256 outputReserve
    ) public pure returns(uint256) {
      require(inputReserve > 0 && outputReserve > 0, "No Liquidity!!!");
      uint256 inputAmountWithFee = inputAmount * 99;

      return (inputAmountWithFee * outputReserve) / ((inputReserve * 100) + inputAmountWithFee);
    }
    
    function ethToAntSwap(uint256 minTokensToReceive) external payable {
        uint256 antTokenReserveBalance = getReserve();
        uint256 tokensToReceive = calculateSwap(msg.value, address(this).balance - msg.value, antTokenReserveBalance);

        require(tokensToReceive >= minTokensToReceive, "Tokens received are less than minimum tokens expected");
       
        antToken.transfer(msg.sender, tokensToReceive);
    }

    function antToEthSwap(uint256 tokensToSwap, uint256 minEthToReceive) external payable {
        uint256 antTokenReserveBalance = getReserve();
        uint256 ethToReceive = calculateSwap(tokensToSwap, antTokenReserveBalance, address(this).balance);
        require(ethToReceive >= minEthToReceive, "ETH received is less than minimum ETH expected");

        antToken.transferFrom(msg.sender, address(this), tokensToSwap);

        payable(msg.sender).transfer(ethToReceive);
    }
    
    receive() external payable {}
    fallback() external payable {}
}
