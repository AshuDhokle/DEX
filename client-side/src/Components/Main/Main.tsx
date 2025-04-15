import React from 'react'
import Exchange from './Exchange'
import { Tabs, TabsProps } from 'antd'
import AddLiquidity from './AddLiquidity'
import RemoveLiquidity from './RemoveLiquidity'
const items: TabsProps['items'] = [
  {
    key: '1',
    label: 'Exchange',
    children: <Exchange />
  },
  {
    key: '2',
    label: 'Add Liquidity',
    children: <AddLiquidity />
  }, 
  {
    key: '3',
    label: 'Remove Liquidity',
    children: <RemoveLiquidity />
  }
]
const Main = () => {

  return (
    <div className='p-10 grid grid-cols-1 mb-4'>
      <div className='flex flex-col'>
        <h1 className='text-5xl font-bold bg-gradient-to-r from-orange-700 via-blue-500 to-green-400 text-transparent bg-clip-text animate-gradient'> Decentralised Exchange Platform to swap.</h1>
        <h1 className='my-8 text-xl font-normal text-white'>Instant Price | Guaranteed Price | Any Pair</h1>
      </div>
      <div className='flex flex-col items-center justify-center'>
        <Tabs
          defaultActiveKey='1'
          items={items}
          tabPosition='top'
          type='card'
          tabBarGutter={20}
          animated
          className='custom-tabs'
        />
      </div>
    </div>
  )
}

export default Main