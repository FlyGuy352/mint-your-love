import { useState, useEffect } from 'react';
import { useNotification } from '@web3uikit/core';
import { useMoralisQuery } from 'react-moralis';
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
    mainQuery.find().then(collectionResults => {
        const plainCollections = collectionResults.map(({ attributes }) => attributes);
        const collectionIds = plainCollections.map(({ objectid }) => objectid);
        const Token = Moralis.Object.extend('Token');
        const tokenQuery = new Moralis.Query(Token);
        tokenQuery.containedIn('collectionId', collectionIds);

        tokenQuery.find().then(tokenResults => {
            const tokensByCollectionId = tokenResults.reduce((acc, cur) => {
                const collectionId = cur.attributes.collectionId;
                return collectionId in acc ? { ...acc, [collectionId]: [...acc[collectionId], cur.attributes] } :
                    { ...acc, [collectionId]: Array(cur.attributes) };
            }, {});
        }).catch(error => {
            console.log('error ', error);
            dispatch({ type: 'error', message: JSON.stringify(error), title: 'Failed to tokens from Moralis', position: 'topL' });
        });
    }).catch(error => {
        console.log('error ', error);
        dispatch({ type: 'error', message: JSON.stringify(error), title: 'Failed to fetch collections from Moralis', position: 'topL' });
    });

    /*const getCollections = async query => {
        return await query.filter(collection => collection.ownerAddress === address.toLowerCase() || collection.linkedPartnerAddress === address.toLowerCase());
    };

    const collections = getCollections(query);
    console.log('collections ', collections)*/
    /*const dispatch = useNotification();

    const [ownedCollections, setOwnedCollections] = useState(null);
    const [linkedCollections, setLinkedCollections] = useState(null);

    const { fetch: fetchOwnedCollections } = useMoralisQuery('Collection', query => query.equalTo('ownerAddress', address.toLowerCase()).descending('timestamp'), [], { autoFetch: false });
    const { fetch: fetchLinkedCollections } = useMoralisQuery('Collection', query => query.equalTo('linkedPartnerAddress', address.toLowerCase()).descending('timestamp'), [], { autoFetch: false });

    useEffect(() => {
        if (isInitialized) {
            fetchOwnedCollections({
                onSuccess: results => {
                    const plainCollections = results.map(({ attributes }) => attributes);
                    setOwnedCollections(plainCollections);
                },
                onError: error => {
                    console.log('error', error);
                    dispatch({ type: 'error', message: JSON.stringify(error), title: 'Failed to fetch owned collections from Moralis', position: 'topL' });
                }
            });

            fetchLinkedCollections({
                onSuccess: results => {
                    const plainCollections = results.map(({ attributes }) => attributes);
                    setLinkedCollections(plainCollections);
                },
                onError: error => {
                    console.log('error', error);
                    dispatch({ type: 'error', message: JSON.stringify(error), title: 'Failed to fetch linked collections from Moralis', position: 'topL' });
                }
            });
        }
    }, [isInitialized]);

    const { fetch: fetchTokens } = useMoralisQuery('Token', query => query.containedIn('collectionId', ownedCollections?.map(({ objectid }) => objectid)?.concat(linkedCollections?.map(({ objectid }) => objectid))).descending('objectid'), [ownedCollections, linkedCollections], { autoFetch: false });
    const [collections, setCollections] = useState(null);
    useEffect(() => {
        if (ownedCollections && linkedCollections) {
            const processCollections = (plainCollections, tokenResults) => {
                const tokensByCollectionId = tokenResults.reduce((acc, cur) => {
                    const collectionId = cur.attributes.collectionId;
                    return collectionId in acc ? { ...acc, [collectionId]: [...acc[collectionId], cur.attributes] } :
                        { ...acc, [collectionId]: Array(cur.attributes) };
                }, {});
                return plainCollections.map(collection => ({ ...collection, tokens: tokensByCollectionId[collection.objectid] || [] }));
            };

            fetchTokens({
                onSuccess: results => setCollections(processCollections(ownedCollections.concat(linkedCollections), results)),
                onError: error => {
                    console.log('error', error);
                    dispatch({ type: 'error', message: JSON.stringify(error), title: 'Failed to fetch tokens from Moralis', position: 'topL' });
                }
            });
        }
    }, [ownedCollections, linkedCollections]);*/

    return { collections: [] };
};