import { useNotification } from '@web3uikit/core';
import { useQuery } from 'react-query';
import Moralis from 'moralis-v1';
import { uniqueObjectsArray } from '../utils/workWithNativeTypes';

const APP_ID_BSC = process.env.NEXT_PUBLIC_APP_ID_BSC;
const SERVER_URL_BSC = process.env.NEXT_PUBLIC_SERVER_URL_BSC;

const APP_ID_MUMBAI = process.env.NEXT_PUBLIC_APP_ID_MUMBAI;
const SERVER_URL_MUMBAI = process.env.NEXT_PUBLIC_SERVER_URL_MUMBAI;

const _fetchCollections = async address => {
    const Collection = Moralis.Object.extend('Collection');
    const ownerQuery = new Moralis.Query(Collection);
    ownerQuery.equalTo('ownerAddress', address);
    const partnerQuery = new Moralis.Query(Collection);
    partnerQuery.equalTo('linkedPartnerAddress', address);    
    const mainQuery = Moralis.Query.or(ownerQuery, partnerQuery);

    const results = await mainQuery.descending('timestamp').find();
    return uniqueObjectsArray(results.map(({ attributes }) => attributes), 'objectid');
};

const _fetchTokens = async collectionIds => {
    const Token = Moralis.Object.extend('Token');
    const tokenQuery = new Moralis.Query(Token);
    tokenQuery.containedIn('collectionId', collectionIds);

    const results = await tokenQuery.descending('timestamp').find();
    return uniqueObjectsArray(results.map(({ attributes }) => attributes), 'objectid');
};

const _groupCollectionTokens = (collections, tokens) => {
    const ownedTokens = tokens.filter(({ collectionId, ownerAddress }) => {
        const collection = collections.find(({ objectid }) => objectid === collectionId);

        // Just in case somehow minter sold token on a marketplace
        return collection && (ownerAddress === collection.ownerAddress || collection.linkedPartnerAddress);
    });

    const tokensByCollectionId = ownedTokens.reduce((acc, cur) => {
        const collectionId = cur.collectionId;
        return collectionId in acc ? { ...acc, [collectionId]: [...acc[collectionId], cur] } :
            { ...acc, [collectionId]: Array(cur) };
    }, {});

    return collections.map(collection => ({ ...collection, tokens: tokensByCollectionId[collection.objectid] || [] }));
};

export const useMoralisCollections = (chainId, address) => {
    Moralis.start({ appId: chainId === 80001 ? APP_ID_MUMBAI : APP_ID_BSC, serverUrl: chainId === 80001 ? SERVER_URL_MUMBAI : SERVER_URL_BSC });
   
    const dispatch = useNotification();
    const findCollections = async () => {
        const collections = await _fetchCollections(address);
        const tokens = await _fetchTokens(collections.map(({ objectid }) => objectid));
        return _groupCollectionTokens(collections, tokens);
    }

    const { data, isFetching, error } = useQuery(['collections', { chainId, address }], findCollections, { 
        refetchOnWindowFocus: false, refetchOnMount: false, refetchOnReconnect: false
    });
    console.log('Moralis collections data: ', data);

    if (error) {
        dispatch({ type: 'error', message: error.message, title: 'Failed to fetch collections from Moralis', position: 'topL' });
    }    

    return { collections: data, isFetching };
};

export const useMoralisTokens = (chainId, tags, profile, timestamp) => {
    Moralis.start({ appId: chainId === 80001 ? APP_ID_MUMBAI : APP_ID_BSC, serverUrl: chainId === 80001 ? SERVER_URL_MUMBAI : SERVER_URL_BSC });
    const Token = Moralis.Object.extend('Token');
    const tokenQuery = new Moralis.Query(Token);
    if (tags !== 'ALL') {
        tags = tags.flatMap(tag => [tag, tag.toLowerCase(), tag.toUpperCase()]);
        tokenQuery.containedIn('tags', tags);
    }
    tokenQuery.containedIn('profile', profile);
    if (timestamp !== 'ALL') {
        tokenQuery.greaterThanOrEqualTo('timestamp', Date.now() / 1000 - timestamp);
    }
    console.log('Fetching Moralis tokens: ', { chainId, tags, profile, timestamp });
    const findTokens = async () => await tokenQuery.find();
    const dispatch = useNotification();
    const { data, isFetching, error } = useQuery(['tokens', 'moralis', { chainId, tags, profile, timestamp }], findTokens, {
        select: results => {
            const parsedResults = results.map(({ attributes }) => attributes);
            return uniqueObjectsArray(parsedResults, 'objectid');
        }, refetchOnWindowFocus: false
    });
    if (error) {
        dispatch({ type: 'error', message: error.message, title: 'Failed to fetch tokens from Moralis', position: 'topL' });
    }    

    return { data, isFetching };
};