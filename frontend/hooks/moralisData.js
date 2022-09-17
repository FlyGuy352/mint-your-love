import { useNotification } from '@web3uikit/core';
import { useQuery } from 'react-query';
import Moralis from 'moralis-v1';

const APP_ID_BSC = process.env.NEXT_PUBLIC_APP_ID_BSC;
const SERVER_URL_BSC = process.env.NEXT_PUBLIC_SERVER_URL_BSC;

const APP_ID_MUMBAI = process.env.NEXT_PUBLIC_APP_ID_MUMBAI;
const SERVER_URL_MUMBAI = process.env.NEXT_PUBLIC_SERVER_URL_MUMBAI;

export const useMoralisCollections = (chainId, address) => {
    Moralis.start({ appId: chainId === 80001 ? APP_ID_MUMBAI : APP_ID_BSC, serverUrl: chainId === 80001 ? SERVER_URL_MUMBAI : SERVER_URL_BSC });
    const Collection = Moralis.Object.extend('Collection');
    const ownerQuery = new Moralis.Query(Collection);
    ownerQuery.equalTo('ownerAddress', address.toLowerCase());
    const partnerQuery = new Moralis.Query(Collection);
    partnerQuery.equalTo('linkedPartnerAddress', address.toLowerCase());    
    const mainQuery = Moralis.Query.or(ownerQuery, partnerQuery);
   
    const dispatch = useNotification();
    const findCollections = async () => await mainQuery.find();
    const { data: collections, error: collectionsError } = useQuery(['collections', { chainId, address }], findCollections, { 
        select: results => results.map(({ attributes }) => attributes)
    });
    if (collectionsError) {
        dispatch({ type: 'error', message: JSON.stringify(collectionsError), title: 'Failed to fetch collections from Moralis', position: 'topL' });
    }

    const Token = Moralis.Object.extend('Token');
    const tokenQuery = new Moralis.Query(Token);
    tokenQuery.containedIn('collectionId', collections?.map(({ objectid }) => objectid));
    const findTokens = async () => await tokenQuery.find();

    const { data: processedTokenResults, isFetching, error: tokensError } = useQuery(['tokens', 'moralis', { chainId, address }], findTokens, { 
        enabled: !!collections,
        select: results => {
            const tokensByCollectionId = results.reduce((acc, cur) => {
                const collectionId = cur.attributes.collectionId;
                return collectionId in acc ? { ...acc, [collectionId]: [...acc[collectionId], cur.attributes] } :
                    { ...acc, [collectionId]: Array(cur.attributes) };
            }, {});
            return collections.map(collection => ({ ...collection, tokens: tokensByCollectionId[collection.objectid] || [] }));
        }
    });

    if (tokensError) {
        dispatch({ type: 'error', message: JSON.stringify(tokensError), title: 'Failed to fetch tokens from Moralis', position: 'topL' });
    }    

    return { collections: processedTokenResults, isFetching };
};

export const useMoralisTokens = (chainId, tags, profile) => {
    console.log('tags ', tags)
    console.log('profile ', profile)
    Moralis.start({ appId: chainId === 80001 ? APP_ID_MUMBAI : APP_ID_BSC, serverUrl: chainId === 80001 ? SERVER_URL_MUMBAI : SERVER_URL_BSC });
    const Token = Moralis.Object.extend('Token');
    const tokenQuery = new Moralis.Query(Token);
    if (tags !== 'ALL') {
        tokenQuery.containedIn('tags', tags);
    }
    tokenQuery.containedIn('profile', profile);

    const findTokens = async () => await tokenQuery.find();
    const dispatch = useNotification();
    const { data, isFetching, error } = useQuery(['tokens', 'moralis', { chainId, tags, profile }], findTokens, {
        select: results => results.map(({ attributes }) => attributes)
    });
    if (error) {
        dispatch({ type: 'error', message: JSON.stringify(error), title: 'Failed to fetch tokens from Moralis', position: 'topL' });
    }    

    return { data, isFetching };
};