const { ethers, network } = require('hardhat');
const fs = require('fs');

const FRONT_END_CONTRACTS_FILE = '../frontend/constants/networkMapping.json';
const FRONT_END_ABI_FILE_LOCATION = '../frontend/constants/';

module.exports = async () => {
    if (process.env.UPDATE_FRONTEND === 'true') {
        const loveToken = await ethers.getContract('LoveToken');
        await updateContractAddress(loveToken);
        await updateAbi(loveToken);
    }
};

async function updateContractAddress(loveToken) {
    const chainId = network.config.chainId.toString();
    const contractAddresses = JSON.parse(fs.readFileSync(FRONT_END_CONTRACTS_FILE, 'utf8'));
    if (chainId in contractAddresses) {
        const chainAddresses = contractAddresses[chainId];
        const loveTokenAddresses = chainAddresses.loveToken;
        if (Array.isArray(loveTokenAddresses)) {
            if (loveTokenAddresses.includes(loveToken.address)) {
                if (loveTokenAddresses.indexOf(loveToken.address) !== loveTokenAddresses.length - 1) {
                    // Make it the last item in the array
                    loveTokenAddresses.splice(loveTokenAddresses.indexOf(loveToken.address), 1);
                    loveTokenAddresses.push(loveToken.address);
                }
            } else {
                loveTokenAddresses.push(loveToken.address);
            }
        } else {
            loveTokenAddresses.loveToken = [loveToken.address];
        }
    } else {
        contractAddresses[chainId] = { loveToken: [loveToken.address] };
    }
    fs.writeFileSync(FRONT_END_CONTRACTS_FILE, JSON.stringify(contractAddresses));
}

async function updateAbi(loveToken) {
    fs.writeFileSync(`${FRONT_END_ABI_FILE_LOCATION}LoveToken.json`, loveToken.interface.format(ethers.utils.FormatTypes.json));
}

module.exports.tags = ['all', 'frontend'];