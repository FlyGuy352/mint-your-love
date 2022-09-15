const { network } = require('hardhat');
const { networkConfig, developmentChains } = require('../helper-hardhat-config');
const { verify } = require('../utils/verify');

module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();
    const args = [networkConfig[network.config.chainId].outbox];
    const loveToken = await deploy('LoveToken', {
        from: deployer,
        args,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1
    });

    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        await verify(loveToken.address, args);
    }
}

module.exports.tags = ['all', 'loveToken', 'main'];