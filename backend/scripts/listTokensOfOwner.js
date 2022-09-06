
const { ethers } = require('hardhat');

async function main() {
    const token = await ethers.getContract('LoveToken');

    const { deployer: account } = await getNamedAccounts();
    const sentLogs = await token.queryFilter(
        token.filters.Transfer(account, null),
    );
    const receivedLogs = await token.queryFilter(
        token.filters.Transfer(null, account),
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
        if (to === account) {
            owned.add(tokenId.toString());
        } else if (from === account) {
            owned.delete(tokenId.toString());
        }
    });

    console.log([...owned].join('\n'));
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.log(error);
        process.exit(1);
    });