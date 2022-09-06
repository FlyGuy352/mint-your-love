import { ethers } from 'ethers';

export default function listTokensOfOwner(signer, ownerAddress) {
    const token = new ethers.Contract(/*contractAddress, abi, signer*/);

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
        if (to === ownerAddress) {
            owned.add(tokenId.toString());
        } else if (from === ownerAddress) {
            owned.delete(tokenId.toString());
        }
    });

    return [...owned];
};