/*const { ethers, network } = require('hardhat');
const fs = require('fs');

const FRONT_END_CONTRACTS_FILES = ['../nextjs-nft-marketplace-fcc/constants/networkMapping.json', '../nextjs-nft-marketplace-thegraph-fcc/constants/networkMapping.json'];
const FRONT_END_ABI_FILE_LOCATIONS = ['../nextjs-nft-marketplace-fcc/constants/', '../nextjs-nft-marketplace-thegraph-fcc/constants/'];*/

module.exports = async () => {
    /*if (process.env.UPDATE_FRONTEND === 'true') {
        console.log('Updating front end...');
        const nftMarketplace = await ethers.getContract('NftMarketplace');
        const basicNft = await ethers.getContract('BasicNft');
        await updateContractAddresses(nftMarketplace);
        await updateAbi(nftMarketplace, basicNft);
    }*/
};

async function updateContractAddresses(nftMarketplace) {
    const chainId = network.config.chainId.toString();
    FRONT_END_CONTRACTS_FILES.forEach(file => {
        const contractAddresses = JSON.parse(fs.readFileSync(file, 'utf8'));
        if (chainId in contractAddresses) {
            const chainAddresses = contractAddresses[chainId];
            const marketplaceAddresses = chainAddresses.NftMarketplace;
            if (Array.isArray(marketplaceAddresses)) {
                if (marketplaceAddresses.includes(nftMarketplace.address)) {
                    if (marketplaceAddresses.indexOf(nftMarketplace.address) !== marketplaceAddresses.length - 1) {
                        // Make it the last item in the array
                        marketplaceAddresses.splice(marketplaceAddresses.indexOf(nftMarketplace.address), 1);
                        marketplaceAddresses.push(nftMarketplace.address);
                    }
                } else {
                    marketplaceAddresses.push(nftMarketplace.address);
                }
            } else {
                chainAddresses.NftMarketplace = [nftMarketplace.address];
            }
        } else {
            contractAddresses[chainId] = { NftMarketplace: [nftMarketplace.address] };
        }
        fs.writeFileSync(file, JSON.stringify(contractAddresses));
    });
}

async function updateAbi(nftMarketplace, basicNft) {
    FRONT_END_ABI_FILE_LOCATIONS.forEach(location => {
        fs.writeFileSync(`${location}NftMarketplace.json`, nftMarketplace.interface.format(ethers.utils.FormatTypes.json));
        fs.writeFileSync(`${location}BasicNft.json`, basicNft.interface.format(ethers.utils.FormatTypes.json));
    });
}

module.exports.tags = ['all', 'frontend'];