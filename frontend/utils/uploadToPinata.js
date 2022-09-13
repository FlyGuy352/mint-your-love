const pinataSDK = require('@pinata/sdk');
require('dotenv').config();

const pinataApiKey = process.env.PINATA_API_KEY;
const pinataApiSecret = process.env.PINATA_API_SECRET;
const pinata = pinataSDK(pinataApiKey, pinataApiSecret);

const pinNftToIpfs = async metadatas => {
    const ipfsHashes = [];

    for (const { name, description, attributes, fileStream } of metadatas) {
        let pinFileResponse;
        if (fileStream) {
            try {
                pinFileResponse = await pinata.pinFileToIPFS(fileStream);
                console.log('Successfully pushed image to pinata');
            } catch (error) {
                console.log(`Error pushing image to pinata - ${error}`);
                reject(error);
            }
        }
        try {
            const { IpfsHash } = await pinata.pinJSONToIPFS({ name, description, attributes, ...pinFileResponse ? { image: `ipfs://${pinFileResponse.IpfsHash}` } : {} });
            ipfsHashes.push(IpfsHash);
        } catch (error) {
            console.log(`Error uploading JSON to Pinata - ${error}`);
            reject(error);
        }
    }

    return ipfsHashes;
};

module.exports = { pinNftToIpfs };