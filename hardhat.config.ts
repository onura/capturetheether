import { HardhatUserConfig } from "hardhat/types";
import "@nomiclabs/hardhat-waffle";

const ROPSTEN_PRIVATE_KEY = ""
const SECONDARY_ACCOUNT_KEY = "";

const config: HardhatUserConfig = {
  solidity: "0.7.4",
  networks: {
    ropsten: {
      url: "https://eth-ropsten.alchemyapi.io/v2/", 
      accounts: [`0x${ROPSTEN_PRIVATE_KEY}`, `0x${SECONDARY_ACCOUNT_KEY}`]
    },
    hardhat: {
      forking: {
        url: "https://eth-ropsten.alchemyapi.io/v2/",
        blockNumber: 10169224,
      },
    },

  }
};

export default config;
