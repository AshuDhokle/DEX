'use client'
import { Web3Context } from '@/Context/Web3Context';
import { Spin } from 'antd';
import React, { useContext, useEffect, useState } from 'react'
import Inputs from './Inputs';
import { ethers } from 'ethers';
import { exchangeContactAddress } from '@/utils/ABI';
import { addLiquidity } from '@/utils/helperFunctions';
const AddLiquidity = () => {

  const { exchangeContract, antContract } = useContext(Web3Context) || {}

  const [loading, setLoading] = useState(false);
  const [value1, setValue1] = useState<number>();
  const [value2, setValue2] = useState<number>();

  useEffect(() => {
    calculate();
  }, [value1])
  
  const calculate = async () =>{
    if (value1 === undefined || value1 === 0){
      setValue2(0)
      return;
    } 
    
    const provider = new ethers.BrowserProvider(window.ethereum);
    let ethReserve = Number((await provider.getBalance(exchangeContactAddress)).toString());
    const tokenReserve = Number((await exchangeContract?.getReserve()));
    
    if(ethReserve == 0 && tokenReserve == 0) {
      setValue2(value1);
      return
    }
    
    setValue2(((ethReserve*value1!) / tokenReserve));
    
  }

  const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addLiquidity(((value1!)*1e18).toString(), value2?.toString(), antContract!, exchangeContract!, setLoading)
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
          <Inputs value={value1} setValue={setValue1} val={'Token'} readonly={false} /> 
        
          <Inputs value={value2} setValue={setValue2} val={'ETH'} readonly={true} /> 
        </div>
        <div className='flex flex-row items-center h-16'>
          <button
            type='submit'
            className='w-full cursor-pointer text-xl font-semibold rounded-2xl bg-amber-400 p-2 m-2 shadow-2xl  text-white transition duration-300 ease-in-out transform hover:scale-101'
          >
            {loading ? <Spin /> : 'Add'}
          </button>
          
        </div>
      </form>
    </div>
  )
}

export default AddLiquidity

