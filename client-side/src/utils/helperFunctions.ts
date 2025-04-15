import { ethers,Contract } from "ethers"; 
import { exchangeAbi, exchangeContactAddress, lpAbi, lpContactAddress, antAbi, antContactAddress } from "./ABI";
export const connectContract = async(
   setExchangeContract : (val : Contract) => void,
   setAntContract : (val: Contract)=>void, 
   setLpContract : (val: Contract)=>void )=>{
 try {
   const provider = new ethers.BrowserProvider(window.ethereum)
   const signer = await provider.getSigner();
   let tempContract = new Contract(exchangeContactAddress, exchangeAbi, signer);
   setExchangeContract(tempContract);
   tempContract = new Contract(antContactAddress, antAbi, signer);
   setAntContract(tempContract);
   tempContract = new Contract(lpContactAddress, lpAbi, signer); 
   setLpContract(tempContract); 
} catch (error) {
    console.log(error);
 } 
}

export const addLiquidity = async(
   amountOfToken: string | undefined,
   amountOfEth: string | undefined,
   antContract : Contract,
   exchangeContract : Contract,
   setLoading: (val : boolean) => void
)=>{
  setLoading(true);
  try {
   const response = await antContract.approve(exchangeContactAddress, amountOfToken);
   console.log(response);
   
   const lptokens = await exchangeContract.addLiquidity(amountOfToken, { value: ethers.parseEther(amountOfEth!) });
   console.log(lptokens);
  } catch (error) {
   console.log(error);
  } finally {
   setLoading(false);
  }
}

export const removeLiquidity = async(
amountOfLpToken : string,
exchangeContract: Contract,
setLoading: (val : boolean) => void) =>{
  setLoading(true);
  try {
   const lpTokensInp = ethers.parseUnits(amountOfLpToken, 18);
   const response = await exchangeContract.removeLiquidity(lpTokensInp)
   console.log(response);
} catch (error) {
   console.log(error)
  } finally {
   setLoading(false);
  }
}

export const exchangeEthForToken = async(
   exchangeContract : Contract,
   ethInput: number,
   minTokenReq: number,
   setLoading: (val: boolean) => void,
)=>{
   setLoading(true);
   try {
      const ethValue = ethers.parseEther(ethInput.toString());
      const minTokens = ethers.parseUnits(minTokenReq.toString());     
      await exchangeContract.ethToAntSwap(minTokens,{value: ethValue});
   } catch (error) {
      console.log(error);
   } finally {
     setLoading(false);
   }
}

export const exchangeTokenForEth = async(
   exchangeContract : Contract,
   antContract: Contract,
   tokensToSwap: number,
   minEthToReceive: number,
   setLoading: (val: boolean) => void,
)=>{
   setLoading(true);
   try {
      await antContract.approve(exchangeContactAddress, tokensToSwap);
      const minEth = await ethers.parseEther(minEthToReceive.toString());
      await exchangeContract.antToEthSwap(tokensToSwap,minEth);
   } catch (error) {
      console.log(error);
   } finally {
     setLoading(false);
   }
}