import { useQuery } from 'react-query';
import { useNotification } from '@web3uikit/core';
import safeFetch from '../utils/fetchWrapper';

export const useIpfsTokens = ({ chainId, collectionId, browseFilters, tokens }) => {
    const fetchTokens = async () => {
        console.log('Fetching all IPFS tokens: ', tokens);
        const fetchTokenInfo = ({ objectid, tags, uri }) => {
            const tokenUri = uri.replace('ipfs://', 'https://ipfs.io/ipfs/');
            return new Promise(async (resolve, reject) => {
                try {
                    const tokenMetadata = await safeFetch(fetch(tokenUri, { signal: AbortSignal.timeout(15000) }));
                    console.log('Fetched single token metadata: ', tokenMetadata);
                    if (tokenMetadata.image) {
                        const imageUri = tokenMetadata.image.replace('ipfs://', 'https://ipfs.io/ipfs/');
                        resolve({ imageToken: { objectid, imageUri, tags } });
                    } else if (tokenMetadata?.attributes?.eventDate) {
                        resolve({ eventToken: { objectid, title: tokenMetadata.name, start: tokenMetadata.attributes.eventDate, allDay: true } });
                    } else {
                        resolve({});
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

        const allTokenInfo = await Promise.all(tokens.map(token => fetchTokenInfo(token)));
        console.log('Fetched all token info: ', allTokenInfo);
        if (collectionId) {
            return allTokenInfo.reduce((acc, cur) => {
                if (cur.imageToken) {
                    return { ...acc, imageTokens: [...acc.imageTokens, cur.imageToken] };
                } else if (cur.eventToken) {
                    return { ...acc, eventTokens: [...acc.eventTokens, cur.eventToken] };
                } else {
                    return acc;
                }
            }, { imageTokens: [], eventTokens: [] });
        } else if (browseFilters) {
            return allTokenInfo.filter(({ imageToken }) => imageToken).map(({ imageToken }) => imageToken);
        }
    };

    const { data, isFetching, error } = useQuery(['tokens', 'ipfs', chainId, collectionId || browseFilters], fetchTokens, { 
        enabled: !!tokens && tokens.every(({ timestamp }) => timestamp), keepPreviousData: true, refetchOnWindowFocus: false
    });

    const dispatch = useNotification();
    if (error) {
        console.log('error', error);
        dispatch({ type: 'error', message: error.message, title: 'Failed to fetch tokens from IPFS', position: 'topL' });
    }

    return { data, isFetching };
};