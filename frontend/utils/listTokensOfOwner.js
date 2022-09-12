/*import { ethers } from 'ethers';
import loveTokenAbi from '../constants/LoveToken.json';
import networkMapping from '../constants/networkMapping.json';

export default async function listTokensOfOwner(chainId, provider, ownerAddress) {
    const loveTokenAddress = networkMapping[chainId].loveToken.at(-1);
    const token = new ethers.Contract(loveTokenAddress, loveTokenAbi, provider);

    const sentLogs = await token.queryFilter(
        token.filters.Transfer(ownerAddress, null),
    );
    const receivedLogs = await token.queryFilter(
        token.filters.Transfer(null, ownerAddress),
    );

    const logs = sentLogs.concat(receivedLogs)
        .sort(
            (a, b) =>
                a.blockNumber - b.blockNumber ||
                a.transactionIndex - b.transactionIndex,
        );

    const owned = new Set();
    logs.forEach(log => {
        const { from, to, tokenId } = log.args;
        if (to.toLowerCase() === ownerAddress.toLowerCase()) {
            owned.add(tokenId.toString());
        } else if (from.toLowerCase() === ownerAddress.toLowerCase()) {
            owned.delete(tokenId.toString());
        }
    });

    return [...owned];
};*/