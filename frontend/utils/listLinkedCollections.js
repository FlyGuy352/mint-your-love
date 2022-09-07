import { ethers } from 'ethers';
import loveTokenAbi from '../constants/LoveToken.json';
import networkMapping from '../constants/networkMapping.json';

export default async function listLinkedCollections(chainId, provider, linkedAddress) {
    const loveTokenAddress = networkMapping[chainId].loveToken.at(-1);
    const token = new ethers.Contract(loveTokenAddress, loveTokenAbi, provider);

    const logs = await token.queryFilter(
        token.filters.LoverLinked(null, linkedAddress),
    );

    return logs.map(({ args: { collectionId } }) => {
        return collectionId;
    });
};