const networkConfig = {
    4: {
        name: 'rinkeby'
    },
    5: {
        name: 'goerli'
    },
    31337: {
        name: 'hardhat',
    },
    97: {
        name: 'bscTestnet',
        outbox: '0xE023239c8dfc172FF008D8087E7442d3eBEd9350'
    },
    80001: {
        name: 'mumbai',
        outbox: '0xe17c37212d785760E8331D4A4395B17b34Ba8cDF'
    },
};

const developmentChains = ['hardhat', 'localhost'];

module.exports = { networkConfig, developmentChains };
