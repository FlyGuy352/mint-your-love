const Moralis = require('moralis-v1/node');
require('dotenv').config();
const contractAddresses = require('../constants/networkMapping.json');

const moralisChainId = process.env.chainId;
const contractAddress = contractAddresses[moralisChainId].loveToken.at(-1);
const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;
const appId = process.env.NEXT_PUBLIC_APP_ID;
const masterKey = process.env.masterKey;

async function main() {
    await Moralis.start({ serverUrl, appId, masterKey });
    console.log(`Working with contract address ${contractAddress} at serverUrl ${serverUrl}`);

    const collectionBurnedOptions = {
        chainId: moralisChainId,
        address: contractAddress,
        sync_historical: true,
        topic: 'CollectionBurned(indexed uint256)',
        abi: {
            "type": "event",
            "anonymous": false,
            "name": "CollectionBurned",
            "inputs": [
                {
                    "type": "uint256",
                    "name": "collectionId",
                    "indexed": true
                }
            ]
        },
        tableName: 'CollectionBurned'
    };

    const collectionCreatedOptions = {
        chainId: moralisChainId,
        address: contractAddress,
        sync_historical: true,
        topic: 'CollectionCreated(indexed uint256,indexed uint256,string,uint8,address)',
        abi: {
            "type": "event",
            "anonymous": false,
            "name": "CollectionCreated",
            "inputs": [
                {
                    "type": "uint256",
                    "name": "collectionId",
                    "indexed": true
                },
                {
                    "type": "uint256",
                    "name": "timestamp",
                    "indexed": true
                },
                {
                    "type": "string",
                    "name": "name",
                    "indexed": false
                },
                {
                    "type": "uint8",
                    "name": "profile",
                    "indexed": false
                },
                {
                    "type": "address",
                    "name": "owner",
                    "indexed": false
                }
            ]
        },
        tableName: 'CollectionCreated'
    };

    const loverLinkedOptions = {
        chainId: moralisChainId,
        address: contractAddress,
        sync_historical: true,
        topic: 'LoverLinked(indexed address,indexed address,indexed uint256)',
        abi: {
            "type": "event",
            "anonymous": false,
            "name": "LoverLinked",
            "inputs": [
                {
                    "type": "address",
                    "name": "linker",
                    "indexed": true
                },
                {
                    "type": "address",
                    "name": "linked",
                    "indexed": true
                },
                {
                    "type": "uint256",
                    "name": "collectionId",
                    "indexed": true
                }
            ]
        },
        tableName: 'LoverLinked'
    };

    const nftMintedOptions = {
        chainId: moralisChainId,
        address: contractAddress,
        sync_historical: true,
        topic: 'NftMinted(indexed uint256,indexed uint256,indexed uint256,string[],string)',
        abi: {
            "type": "event",
            "anonymous": false,
            "name": "NftMinted",
            "inputs": [
                {
                    "type": "uint256",
                    "name": "tokenId",
                    "indexed": true
                },
                {
                    "type": "uint256",
                    "name": "collectionId",
                    "indexed": true
                },
                {
                    "type": "uint256",
                    "name": "timestamp",
                    "indexed": true
                },
                {
                    "type": "string[]",
                    "name": "tags",
                    "indexed": false
                },
                {
                    "type": "string",
                    "name": "uri",
                    "indexed": false
                }
            ]
        },
        tableName: 'NftMinted'
    };

    const transferOptions = {
        chainId: moralisChainId,
        address: contractAddress,
        sync_historical: true,
        topic: 'Transfer(indexed address,indexed address,indexed uint256)',
        abi: {
            "type": "event",
            "anonymous": false,
            "name": "Transfer",
            "inputs": [
                {
                    "type": "address",
                    "name": "from",
                    "indexed": true
                },
                {
                    "type": "address",
                    "name": "to",
                    "indexed": true
                },
                {
                    "type": "uint256",
                    "name": "tokenId",
                    "indexed": true
                }
            ]
        },
        tableName: 'Transferred'
    };

    const collectionBurnedResponse = await Moralis.Cloud.run('watchContractEvent', collectionBurnedOptions, { useMasterKey: true });
    const collectionCreatedResponse = await Moralis.Cloud.run('watchContractEvent', collectionCreatedOptions, { useMasterKey: true });
    const loverLinkedResponse = await Moralis.Cloud.run('watchContractEvent', loverLinkedOptions, { useMasterKey: true });
    const nftMintedResponse = await Moralis.Cloud.run('watchContractEvent', nftMintedOptions, { useMasterKey: true });
    const transferResponse = await Moralis.Cloud.run('watchContractEvent', transferOptions, { useMasterKey: true });
    if (collectionBurnedResponse.success && collectionCreatedResponse.success && loverLinkedResponse.success && nftMintedResponse.success && transferResponse.success) {
        console.log('Success! Database updated with watching events');
    } else {
        console.log('Something went wrong updating database with watch events...');
    }
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });