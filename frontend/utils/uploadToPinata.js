/*const pinataSDK = require('@pinata/sdk');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const pinataApiKey = process.env.PINATA_API_KEY;
const pinataApiSecret = process.env.PINATA_API_SECRET;
const pinata = pinataSDK(pinataApiKey, pinataApiSecret);

async function storeImages(imagesFilePath) {
    const fullImagesPath = path.resolve(imagesFilePath);
    const fileNames = fs.readdirSync(fullImagesPath);
    const responses = [];
    console.log('Storing Images');
    for (const fileName of fileNames) {
        const readableStreamForFile = fs.createReadStream(`${fullImagesPath}/${fileName}`);
        try {
            const response = await pinata.pinFileToIPFS(readableStreamForFile);
            console.log(`Successfully pushed image ${fileName} to pinata`);
            responses.push(response);
        } catch (error) {
            console.log(`Error pushing ${fileName} to pinata`);
        }
    }

    return { responses, fileNames };
}

async function storeTokenUriMetadata(metadata) {
    try {
        const response = await pinata.pinJSONToIPFS(metadata);
        return response;
    } catch (error) {
        console.log(`Error uploading JSON ${metadata} to Pinata`);
    }
}

module.exports = { storeImages, storeTokenUriMetadata };*/