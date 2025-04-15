import 'dotenv/config'
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import 'hardhat-deploy'
import 'hardhat-deploy-ethers'
const config: HardhatUserConfig = {
  solidity: "0.8.28",
  defaultNetwork: 'hardhat',
  networks:{
    sepolia:{
      url: process.env.SE_RPC_URL,
      accounts: [`${process.env.SE_KEY}`],
      chainId:11155111,
    }
  },
  namedAccounts:{
    deployer:{
      default:0,
    },
    users:{
      default:0,
    }
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API,
  },
};

export default config;
