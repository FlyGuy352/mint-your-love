import { useState, useEffect } from 'react';
import { useNotification } from '@web3uikit/core';
import { useMoralisQuery } from 'react-moralis';
import { useAccount } from 'wagmi';
import { useMoralis } from 'react-moralis';

export const useTokenCollections = () => {
    const { address } = useAccount();
    const { isInitialized } = useMoralis();

    const dispatch = useNotification();

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
                    dispatch({ type: 'error', message: JSON.stringify(error), title: 'Failed to fetch owned collections', position: 'topL' });
                }
            });

            fetchLinkedCollections({
                onSuccess: results => {
                    const plainCollections = results.map(({ attributes }) => attributes);
                    setLinkedCollections(plainCollections);
                },
                onError: error => {
                    console.log('error', error);
                    dispatch({ type: 'error', message: JSON.stringify(error), title: 'Failed to fetch linked collections', position: 'topL' });
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
                    dispatch({ type: 'error', message: JSON.stringify(error), title: 'Failed to fetch tokens', position: 'topL' });
                }
            });
        }
    }, [ownedCollections, linkedCollections]);

    return { collections };
};