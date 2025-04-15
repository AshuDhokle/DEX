'use client' 
import React, {useState, createContext, useEffect} from 'react'
import { Contract} from 'ethers'
import { useAccount } from 'wagmi';
import { connectContract } from '@/utils/helperFunctions';

interface IWeb3Context {
  exchangeContract : Contract | null,
  lpContract: Contract | null,
  antContract: Contract | null
}

export const Web3Context = createContext<IWeb3Context | null>(null);

export const Web3Provider = ({children}:{children : React.ReactNode})=>{
  const [exchangeContract, setExchangeContract] = useState<Contract | null>(null);
  const [lpContract, setLpContract] = useState<Contract| null>(null);
  const [antContract, setAntContract] = useState<Contract| null>(null);
  const {address} = useAccount();
  
  useEffect(()=>{  
    if(address) {
      connectContract(setExchangeContract, setAntContract, setLpContract);
    }
  },[address])

  return (
    <Web3Context.Provider value={{exchangeContract, lpContract, antContract}}>
        {children}
    </Web3Context.Provider>
  )
}
