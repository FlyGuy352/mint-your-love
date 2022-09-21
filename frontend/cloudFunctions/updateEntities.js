Moralis.Cloud.afterSave('CollectionBurned', async request => {
    const logger = Moralis.Cloud.getLogger();
    const confirmed = request.object.get('confirmed')
    logger.info(`Processing CollectionBurned Tx - Confirmed ? : ${confirmed}`);
    if (!confirmed) { // We sacrifice finality for speed as it otherwise takes too long for the frontend to render the correct data
        const CollectionObject = Moralis.Object.extend('Collection');
        const query = new Moralis.Query(CollectionObject);
        query.equalTo('objectid', request.object.get('collectionId'));
        const collection = await query.first();
        
        await collection.destroy();
    }
});

Moralis.Cloud.afterSave('CollectionCreated', async request => {
    const logger = Moralis.Cloud.getLogger();
    const confirmed = request.object.get('confirmed')
    logger.info(`Processing CollectionCreated Tx - Confirmed ? : ${confirmed}`);
    if (!confirmed) {
        const CollectionObject = Moralis.Object.extend('Collection');
        const collection = new CollectionObject();
        collection.set('objectid', request.object.get('collectionId'));
        collection.set('timestamp', request.object.get('timestamp_decimal'));
        collection.set('name', request.object.get('name'));
        collection.set('profile', ['STRAIGHT', 'SAME_SEX', 'OTHERS'][request.object.get('profile')]);
        collection.set('ownerAddress', request.object.get('owner'));
        await collection.save();
    }
});

Moralis.Cloud.afterSave('LoverLinked', async request => {
    const logger = Moralis.Cloud.getLogger();
    const confirmed = request.object.get('confirmed')
    logger.info(`Processing LoverLinked Tx - Confirmed ? : ${confirmed}`);
    if (!confirmed) {
        const CollectionObject = Moralis.Object.extend('Collection');
        const query = new Moralis.Query(CollectionObject);
        query.equalTo('objectid', request.object.get('collectionId'));
        const collection = await query.first();
        collection.set('linkedPartnerAddress', request.object.get('linked'));
        await collection.save();
    }
});

Moralis.Cloud.afterSave('NftMinted', async request => {
    const logger = Moralis.Cloud.getLogger();
    const confirmed = request.object.get('confirmed')
    logger.info(`Processing NftMinted Tx - Confirmed ? : ${confirmed}`);
    if (!confirmed) {
        const TokenObject = Moralis.Object.extend('Token');
        const tokenQuery = new Moralis.Query(TokenObject);
        tokenQuery.equalTo('objectid', request.object.get('tokenId'));
        const token = await tokenQuery.first();

        token.set('timestamp', request.object.get('timestamp_decimal'));
        token.set('tags', request.object.get('tags'));
        token.set('uri', request.object.get('uri'));
        token.set('collectionId', request.object.get('collectionId'));

        const CollectionObject = Moralis.Object.extend('Collection');
        const collectionQuery = new Moralis.Query(CollectionObject);
        collectionQuery.equalTo('objectid', request.object.get('collectionId'));
        const collection = await collectionQuery.first();
        token.set('profile', collection.get('profile'));

        await token.save();
    }
});

Moralis.Cloud.afterSave('Transferred', async request => {
    const logger = Moralis.Cloud.getLogger();
    const confirmed = request.object.get('confirmed')
    logger.info(`Processing Transferred Tx - Confirmed ? : ${confirmed}`);
    const tokenId = request.object.get('tokenId');
    if (!confirmed) {
        const TokenObject = Moralis.Object.extend('Token');
        const query = new Moralis.Query(TokenObject);
        query.equalTo('objectid', request.object.get('tokenId'));
        let token = await query.first();
        if (request.object.get('to') === '0x0000000000000000000000000000000000000000') {
            logger.info('Burning token ' + tokenId);
            return await token.destroy();
        } else if (!token) {
            logger.info('Transferring new token ' + tokenId);
            token = new TokenObject();
            token.set('objectid', tokenId);
        }
        logger.info('Setting token owner address: ' + request.object.get('to'));
        token.set('ownerAddress', request.object.get('to'));
        await token.save();
    }
});