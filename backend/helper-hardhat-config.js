const { ethers } = require('hardhat');

const networkConfig = {
    4: {
        name: 'rinkeby',
        mintFee: ethers.utils.parseEther('0.01'),
    },
    31337: {
        name: 'hardhat',
        mintFee: ethers.utils.parseEther('0.01')
    }
};

const developmentChains = ['hardhat', 'localhost'];

module.exports = {
    networkConfig,
    developmentChains
};
