import { useState } from 'react';
import { useQuery } from 'react-query';
import { useNotification } from '@web3uikit/core';
import safeFetch from '../utils/fetchWrapper';

export const useIpfsTokens = (collectionId, tokens) => {
    const [cacheCollectionId, setCacheCollectionId] = useState(null);
    
    const fetchTokens = async () => {
        console.log('fetching... ', tokens)
        const fetchTokenInfo = ({ objectid, tags, uri }) => {
            const tokenUri = uri.replace('ipfs://', 'https://ipfs.io/ipfs/');
            return new Promise(async (resolve, reject) => {
                try {
                    console.log('tokenUri ', tokenUri)
                    const tokenMetadata = await safeFetch(fetch(tokenUri, { signal: AbortSignal.timeout(10000) }));
                    console.log('tokenMetadata ', tokenMetadata)
                    if (tokenMetadata.image) {
                        const imageUri = tokenMetadata.image.replace('ipfs://', 'https://ipfs.io/ipfs/');
                        resolve({ imageToken: { objectid, imageUri, tags } });
                    } else if (tokenMetadata?.attributes?.eventDate) {
                        resolve({ eventToken: { objectid, title: tokenMetadata.name, start: tokenMetadata.attributes.eventDate, allDay: true } });
                    }
                } catch (error) {
                    if (error.name === 'AbortError') {
                        console.log('Aborting long IPFS request...');
                        resolve({});
                    } else {
                        console.log('error ', error);
                        reject(error);
                    }
                }
            });
        };

        setCacheCollectionId(collectionId);
        const allTokenInfo = await Promise.all(tokens.map(token => fetchTokenInfo(token)));
        console.log('allTokenInfo ', allTokenInfo)
        return allTokenInfo.reduce((acc, cur) => {
            if (cur.imageToken) {
                return { ...acc, imageTokens: [...acc.imageTokens, cur.imageToken] };
            } else if (cur.eventToken) {
                return { ...acc, eventTokens: [...acc.eventTokens, cur.eventToken] };
            } else {
                return acc;
            }
        }, { imageTokens: [], eventTokens: [] });
    };

    const { data, isFetching, isIdle, error } = useQuery(['tokens', 'collection', collectionId], fetchTokens, { 
        enabled: tokens !== null && tokens !== undefined && collectionId !== cacheCollectionId
    });
    const dispatch = useNotification();
    if (error) {
        console.log('error', error);
        dispatch({ type: 'error', message: JSON.stringify(error), title: 'Failed to fetch tokens from IPFS', position: 'topL' });
    }

    return { data, isFetching, isIdle };
};