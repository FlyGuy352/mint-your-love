import { useNotification } from '@web3uikit/core';
import { useMoralisQuery } from 'react-moralis';
import { useAccount } from 'wagmi';

export const useTokenCollections = () => {
    const { address } = useAccount();

    const dispatch = useNotification();
    const { isFetching: fetchingOwnedCollections, error: ownedCollectionsError, data: ownedCollections } = useMoralisQuery('Collection', query => query.equalTo('ownerAddress', address.toLowerCase()));
    if (ownedCollectionsError) {
        dispatch({ type: 'error', message: JSON.stringify(ownedCollectionsError), title: 'Failed to fetch owned collections', position: 'topL' });
    }
    const { isFetching: fetchingLinkedCollections, error: linkedCollectionsError, data: linkedCollections } = useMoralisQuery('Collection', query => query.equalTo('linkedPartnerAddress', address.toLowerCase()));
    if (linkedCollectionsError) {
        dispatch({ type: 'error', message: JSON.stringify(linkedCollectionsError), title: 'Failed to fetch linked collections', position: 'topL' });
    }

    const { isFetching: fetchingTokens, error: tokensError, data: tokens } = useMoralisQuery('Token', query => query.containedIn('collectionId', ownedCollections.map(({ attributes: { objectid } }) => objectid).concat(linkedCollections.map(({ attributes: { objectid } }) => objectid))), [ownedCollections, linkedCollections]);
    if (tokensError) {
        dispatch({ type: 'error', message: JSON.stringify(error), title: 'Failed to fetch tokens', position: 'topL' });
    }
    console.log('tokens ', tokens)
    return { collections: (fetchingOwnedCollections || fetchingLinkedCollections || fetchingTokens) ? null : tokens };
};