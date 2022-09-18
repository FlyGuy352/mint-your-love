import pinataSDK from '@pinata/sdk';

const pinataApiKey = process.env.PINATA_API_KEY;
const pinataApiSecret = process.env.PINATA_API_SECRET;
const pinata = pinataSDK(pinataApiKey, pinataApiSecret);

const pinNftToIpfs = async metadatas => {
    const imgHashes = [];
    const jsonHashes = [];

    for (const { name, description, attributes, fileStream } of metadatas) {
        let pinFileResponse;
        if (fileStream) {
            try {
                pinFileResponse = await pinata.pinFileToIPFS(fileStream);
                console.log('Successfully pushed image to pinata');
                imgHashes.push(pinFileResponse.IpfsHash);
            } catch (error) {
                console.log(`Error pushing image to pinata - ${JSON.stringify(error)}`);
                throw error;
            }
        }
        try {
            const { IpfsHash } = await pinata.pinJSONToIPFS({ name, description, attributes, ...pinFileResponse ? { image: `ipfs://${pinFileResponse.IpfsHash}` } : {} });
            jsonHashes.push(IpfsHash);
        } catch (error) {
            console.log(`Error uploading JSON to Pinata - ${JSON.stringify(error)}`);
            throw error;
        }
    }

    return { imgHashes, jsonHashes };
};

module.exports = { pinNftToIpfs };