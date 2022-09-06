const { ethers } = require('hardhat');

async function main() {
    const { deployer } = await getNamedAccounts();

    const loveToken = await ethers.getContract('LoveToken', deployer);
    const loveTokenMintTx = await loveToken.mintNewCollection('test');
    await loveTokenMintTx.wait(1);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.log(error);
        process.exit(1);
    });