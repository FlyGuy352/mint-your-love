//require("@nomiclabs/hardhat-toolkit");
require("@nomiclabs/hardhat-etherscan");
require("hardhat-deploy");
require("solidity-coverage");
require("hardhat-gas-reporter");
require("@nomiclabs/hardhat-ethers");
require("hardhat-contract-sizer");
require("dotenv").config();
require("@nomicfoundation/hardhat-chai-matchers");

const RINKEBY_RPC_URL = process.env.RINKEBY_RPC_URL || 'https://eth-rinkeby';
const RINKEBY_PRIVATE_KEY = process.env.RINKEBY_PRIVATE_KEY || '0xkey';
const GOERLI_RPC_URL = process.env.GOERLI_RPC_URL || 'https://eth-goerli';
const GOERLI_PRIVATE_KEY = process.env.GOERLI_PRIVATE_KEY || '0xkey';
const BSC_TESTNET_RPC_URL = process.env.BSC_TESTNET_RPC_URL;
const BSC_TESTNET_PRIVATE_KEY = process.env.BSC_TESTNET_PRIVATE_KEY || '0xkey';
const MUMBAI_RPC_URL = process.env.MUMBAI_RPC_URL;
const MUMBAI_PRIVATE_KEY = process.env.MUMBAI_PRIVATE_KEY || '0xkey';
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || 'key';
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY || 'key';

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    defaultNetwork: "hardhat",
    networks: {
        hardhat: {
            chainId: 31337,
            blockConfirmations: 1
        },
        localhost: {
            chainId: 31337,
            blockConfirmations: 1
        },
        rinkeby: {
            url: RINKEBY_RPC_URL,
            accounts: [RINKEBY_PRIVATE_KEY],
            chainId: 4,
            blockConfirmations: 6
        },
        goerli: {
            url: GOERLI_RPC_URL,
            accounts: [GOERLI_PRIVATE_KEY],
            chainId: 5,
            blockConfirmations: 6
        },
        bscTestnet: {
            url: BSC_TESTNET_RPC_URL,
            chainId: 97,
            gasPrice: 20000000000,
            accounts: [BSC_TESTNET_PRIVATE_KEY]
        },
        mumbai: {
            url: MUMBAI_RPC_URL,
            chainId: 80001,
            accounts: [MUMBAI_PRIVATE_KEY]
        }
    },
    etherscan: {
        apiKey: {
            goerli: ETHERSCAN_API_KEY
        }
    },
    gasReporter: {
        enabled: false,
        outputFile: 'gas-report.txt',
        noColors: true,
        currency: 'SGD',
        coinmarketcap: COINMARKETCAP_API_KEY
    },
    solidity: {
        compilers: [
            {
                version: '0.8.15'
            },
            {
                version: '0.6.6'
            }
        ]
    },
    namedAccounts: {
        deployer: {
            default: 0
        },
        player: {
            default: 1
        }
    },
    mocha: {
        timeout: 500000 // 500 seconds
    }
};