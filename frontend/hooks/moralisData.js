import { useNotification } from '@web3uikit/core';
import { useQuery } from 'react-query';
import Moralis from 'moralis-v1';
import { uniqueObjectsArray } from '../utils/workWithNativeTypes';

const APP_ID_BSC = process.env.NEXT_PUBLIC_APP_ID_BSC;
const SERVER_URL_BSC = process.env.NEXT_PUBLIC_SERVER_URL_BSC;

const APP_ID_MUMBAI = process.env.NEXT_PUBLIC_APP_ID_MUMBAI;
const SERVER_URL_MUMBAI = process.env.NEXT_PUBLIC_SERVER_URL_MUMBAI;

export const useMoralisCollections = (chainId, address) => {
    Moralis.start({ appId: chainId === 80001 ? APP_ID_MUMBAI : APP_ID_BSC, serverUrl: chainId === 80001 ? SERVER_URL_MUMBAI : SERVER_URL_BSC });
    const Collection = Moralis.Object.extend('Collection');
    const ownerQuery = new Moralis.Query(Collection);
    ownerQuery.equalTo('ownerAddress', address);
    const partnerQuery = new Moralis.Query(Collection);
    partnerQuery.equalTo('linkedPartnerAddress', address);    
    const mainQuery = Moralis.Query.or(ownerQuery, partnerQuery);
   
    const dispatch = useNotification();
    const findCollections = async () => {
        // Unlike the other queries, we do the transformation within the query function here because we cannot otherwise intercept the query cache data after user mints NFT
        const results = await mainQuery.descending('timestamp').find();
        return uniqueObjectsArray(results.map(({ attributes }) => attributes), 'objectid');
    }
    const { data: collections, error: collectionsError } = useQuery(['collections', { chainId, address }], findCollections, { 
        refetchOnWindowFocus: false, refetchOnMount: false, refetchOnReconnect: false
    });
    if (collectionsError) {
        dispatch({ type: 'error', message: collectionsError.message, title: 'Failed to fetch collections from Moralis', position: 'topL' });
    }
    console.log('collections in hook ', collections)

    const Token = Moralis.Object.extend('Token');
    const tokenQuery = new Moralis.Query(Token);
    tokenQuery.containedIn('collectionId', collections?.map(({ objectid }) => objectid));
    const findTokens = async () => await tokenQuery.descending('timestamp').find();

    const { data: processedTokenResults, isFetching, error: tokensError } = useQuery(['tokens', 'moralis', { chainId, address }], findTokens, { 
        enabled: !!collections,
        select: results => {
            const parsedResults = results.map(({ attributes }) => attributes);
            const uniqueResults = uniqueObjectsArray(parsedResults, 'objectid');
            console.log('uniqueResults ', uniqueResults)
            const ownedTokenResults = uniqueResults.filter(({ collectionId, ownerAddress }) => {
                const collection = collections.find(({ objectid }) => objectid === collectionId);
                return collection && (ownerAddress === collection.ownerAddress || collection.linkedPartnerAddress); // Just in case somehow minter sold token on a marketplace
            });
            const tokensByCollectionId = ownedTokenResults.reduce((acc, cur) => {
                const collectionId = cur.collectionId;
                return collectionId in acc ? { ...acc, [collectionId]: [...acc[collectionId], cur] } :
                    { ...acc, [collectionId]: Array(cur) };
            }, {});
            return collections.map(collection => ({ ...collection, tokens: tokensByCollectionId[collection.objectid] || [] }));
        }, refetchOnWindowFocus: false, refetchOnMount: false, refetchOnReconnect: false
    });
    console.log('processedTokenResults ', processedTokenResults)

    if (tokensError) {
        dispatch({ type: 'error', message: tokensError.message, title: 'Failed to fetch tokens from Moralis', position: 'topL' });
    }    

    return { collections: processedTokenResults, isFetching };
};

export const useMoralisTokens = (chainId, tags, profile, timestamp) => {
    Moralis.start({ appId: chainId === 80001 ? APP_ID_MUMBAI : APP_ID_BSC, serverUrl: chainId === 80001 ? SERVER_URL_MUMBAI : SERVER_URL_BSC });
    const Token = Moralis.Object.extend('Token');
    const tokenQuery = new Moralis.Query(Token);
    if (tags !== 'ALL') {
        tokenQuery.containedIn('tags', tags);
    }
    tokenQuery.containedIn('profile', profile);
    if (timestamp !== 'ALL') {
        tokenQuery.greaterThanOrEqualTo('timestamp', Date.now() - timestamp);
    }

    const findTokens = async () => await tokenQuery.find();
    const dispatch = useNotification();
    const { data, isFetching, error } = useQuery(['tokens', 'moralis', { chainId, tags, profile }], findTokens, {
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