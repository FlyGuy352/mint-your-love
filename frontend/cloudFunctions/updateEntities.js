Moralis.Cloud.afterSave('CollectionBurned', async request => {
    const logger = Moralis.Cloud.getLogger();
    const confirmed = request.object.get('confirmed')
    logger.info(`Processing Tx - Confirmed ? : ${confirmed}`);
    if (confirmed) {
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
    logger.info(`Processing Tx - Confirmed ? : ${confirmed}`);
    if (confirmed) {
        const CollectionObject = Moralis.Object.extend('Collection');
        const collection = new CollectionObject();
        collection.set('objectid', request.object.get('collectionId'));
        collection.set('timestamp', request.object.get('timestamp'));
        collection.set('name', request.object.get('name'));
        collection.set('profile', ['STRAIGHT', 'SAME_SEX', 'OTHERS'][request.object.get('profile')]);
        collection.set('ownerAddress', request.object.get('owner'));
        await collection.save();
    }
});

Moralis.Cloud.afterSave('LoverLinked', async request => {
    const logger = Moralis.Cloud.getLogger();
    const confirmed = request.object.get('confirmed')
    logger.info(`Processing Tx - Confirmed ? : ${confirmed}`);
    if (confirmed) {
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
    logger.info(`Processing Tx - Confirmed ? : ${confirmed}`);
    if (confirmed) {
        const TokenObject = Moralis.Object.extend('Token');
        const token = new TokenObject();
        token.set('objectid', request.object.get('tokenId'));
        token.set('timestamp', request.object.get('timestamp'));
        token.set('tags', request.object.get('tags'));
        token.set('uri', request.object.get('uri'));
        token.set('collectionId', request.object.get('collectionId'));

        const CollectionObject = Moralis.Object.extend('Collection');
        const query = new Moralis.Query(CollectionObject);
        query.equalTo('objectid', request.object.get('collectionId'));
        const collection = await query.first();
        token.set('profile', collection.get('profile'));

        await token.save();
    }
});

Moralis.Cloud.afterSave('Transfer', async request => {
    const logger = Moralis.Cloud.getLogger();
    const confirmed = request.object.get('confirmed')
    logger.info(`Processing Tx - Confirmed ? : ${confirmed}`);
    if (confirmed) {
        const TokenObject = Moralis.Object.extend('Token');
        const query = new Moralis.Query(TokenObject);
        query.equalTo('objectid', request.object.get('tokenId'));
        let token = await query.first();

        if (!token) {
            token = new TokenObject();
            token.set('objectid', request.object.get('tokenId'));
        }
        token.set('ownerAddress', request.object.get('to'));
        await token.save();
    }
});