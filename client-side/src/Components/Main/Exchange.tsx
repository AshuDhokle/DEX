'use client'
import { ethers } from 'ethers';
import { exchangeContactAddress } from '@/utils/ABI';
import { Web3Context } from '@/Context/Web3Context';
import { Spin } from 'antd';
import React, { useContext, useEffect, useState } from 'react'
import { SwapOutlined } from '@ant-design/icons'
import Inputs from './Inputs';
import { exchangeEthForToken, exchangeTokenForEth } from '@/utils/helperFunctions';
const Exchange = () => {

  const { exchangeContract, antContract } = useContext(Web3Context) || {}

  const [swapped, setSwapped] = useState(false);
  const [loading, setLoading] = useState(false);
  const [value1, setValue1] = useState<number>();
  const [value2, setValue2] = useState<number>();

  useEffect(() => {
    calculateExchange();
  }, [value1,swapped])
  
  const calculateExchange = async()=>{
    if (value1 === undefined || value1 === 0) {
      setValue2(0)
      return;
    }  
      if (value1) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const ethReserve = Number((await provider.getBalance(exchangeContactAddress)).toString())/1e18;
        const tokenReserve = Number((await exchangeContract?.getReserve()))/1e18;
        
        if (!swapped) {
          const ethInp = value1
          const tokenOup = (ethInp*99 * tokenReserve) / (ethInp*99 + (ethReserve*100));
          setValue2(tokenOup);
        } else {
          const tokenInp = value1
          const ethOup = (tokenInp*99 * ethReserve) / (tokenInp + (tokenReserve*100));
          setValue2(ethOup);
        }
      }
  }
  
  const handleSwap = () =>{
    setSwapped(!swapped);
    // calculateExchange()
  }

  const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if(swapped){
        await exchangeTokenForEth(exchangeContract!, antContract!, value1!, value2!, setLoading);
      } else {
        await exchangeEthForToken(exchangeContract!, value1!, value2!, setLoading);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setValue1(0);
      setValue2(0);
    }
  };

  return (
    <div className='flex flex-col items-center justify-center'>
      <form
        onSubmit={handleSubmit}
        className='w-[400px] p-4 m-2 flex flex-col'
        style={{ background: '#222222' }}
      >
        <div className="input-swap-container">
          {swapped ? <Inputs value={value1} setValue={setValue1} val={'Token'} readonly={false} /> : <Inputs value={value1} setValue={setValue1} val={'ETH'} readonly={false} />}

          <SwapOutlined className="swap-icon" onClick={() => handleSwap()} />

          {swapped ? <Inputs value={value2} setValue={setValue2} val={'ETH'} readonly={true} /> : <Inputs value={value2} setValue={setValue2} val={'Token'} readonly={true} />}
        </div>

        <button
          type="submit"
          className="relative z-10 text-xl p-2 my-2 text-white bg-amber-400 rounded-xl shadow-xl transition duration-300 ease-in-out transform hover:scale-101"
          
        >
          {loading ? <Spin /> : '🚀 Swap'}
        </button>


      </form>
    </div>
  )
}

export default Exchange

