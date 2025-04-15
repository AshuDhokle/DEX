'use client'
import React from 'react'
import Inputs from './Inputs'
import { useContext, useEffect, useState } from 'react'
import { Web3Context } from '@/Context/Web3Context'
import { Spin } from 'antd'
import { removeLiquidity } from '@/utils/helperFunctions'
import { ethers } from 'ethers'
import { exchangeContactAddress } from '@/utils/ABI'
const RemoveLiquidity = () => {
  const { exchangeContract, lpContract } = useContext(Web3Context) || {}
  
    const [loading, setLoading] = useState(false);
    const [value1, setValue1] = useState<number>();
    const [value2, setValue2] = useState<number>();
    const [value3, setValue3] = useState<number>();  
    
    useEffect(() => {
      calculate();
    }, [value1])
    
    const calculate = async () =>{
      const provider = new ethers.BrowserProvider(window.ethereum);
      const ethReserve = Number((await provider.getBalance(exchangeContactAddress)).toString())/1e18;
      const tokenReserve = Number((await exchangeContract?.getReserve()))/1e18;
      const lpTokenTotalSupply = Number((await lpContract?.totalSupply()).toString())/1e18;
      
      const ethToReturn = (ethReserve * value1!)/lpTokenTotalSupply;
      const antToReturn = (tokenReserve * value1!)/lpTokenTotalSupply;
      
      setValue2(ethToReturn);
      setValue3(antToReturn);
    }
  
    const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setLoading(true);
      try {
        if(value1)
            await removeLiquidity(value1.toString(), exchangeContract!, setLoading)
      } catch (error) {
        console.log(error);
      } finally {
        setValue1(0)
        setValue2(0)
        setValue3(0)
      }
    };
  
    return (
      <div className='flex flex-col items-center justify-center'>
        <form
          onSubmit={handleSubmit}
          className='w-[400px] p-4 m-2 flex flex-col'
          style={{ background: '#222222' }}
        >
          <div className="input-swap-container mb-4">
            <Inputs value={value1} setValue={setValue1} val={'LpToken'} readonly={false} />  
          </div>
          <div className='flex flex-row '>
            <Inputs value={value2} setValue={setValue2} val={'Eth'} readonly={true}/>
            <Inputs value={value3} setValue={setValue3} val={'Ant'} readonly={true}/>
          </div>
          <div className='flex flex-row items-center h-16'>
            <button
              type='submit'
              className='w-full cursor-pointer text-xl font-semibold rounded-2xl bg-amber-400 p-2 m-2 shadow-2xl  text-white transition duration-300 ease-in-out transform hover:scale-101'
            >
              {loading ? <Spin /> : 'Remove'}
            </button>
            
          </div>
        </form>
      </div>
    )
}

export default RemoveLiquidity