import pinataSDK from '@pinata/sdk';

const pinataApiKey = process.env.PINATA_API_KEY;
const pinataApiSecret = process.env.PINATA_API_SECRET;
const pinata = pinataSDK(pinataApiKey, pinataApiSecret);

const pinNftToIpfs = async ({ name, description, attributes, fileStream }) => {
    let imgHash;
    let jsonHash;

    let pinFileResponse;
    if (fileStream) {
        try {
            pinFileResponse = await pinata.pinFileToIPFS(fileStream);
            console.log('Successfully pushed image to pinata');
            imgHash = pinFileResponse.IpfsHash;
        } catch (error) {
            console.log(`Error pushing image to pinata - ${JSON.stringify(error)}`);
            throw error;
        }
    }
    try {
        const { IpfsHash } = await pinata.pinJSONToIPFS({ name, description, attributes, ...pinFileResponse ? { image: `ipfs://${pinFileResponse.IpfsHash}` } : {} });
        jsonHash = IpfsHash;
    } catch (error) {
        console.log(`Error uploading JSON to Pinata - ${JSON.stringify(error)}`);
        throw error;
    }

    return { imgHash, jsonHash };
};

module.exports = { pinNftToIpfs };