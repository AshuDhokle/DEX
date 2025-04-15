'use client'
import React from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import {Layout} from 'antd'
const {Header} = Layout
const headerStyle: React.CSSProperties = {
    textAlign: 'center',
    color: 'white',
    height: 64,
    paddingInline: 48,
    lineHeight: '64px',
    backgroundColor: '#222222',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  };
const Navbar = () => {
  return (
    <Header style={headerStyle}>
        <h1>DEX</h1>
        <ConnectButton />
    </Header>
  )
}

export default Navbar