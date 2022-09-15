import { createContext, useEffect, useState } from 'react';
import MintBanner from '../components/MintBanner';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Calendar from '../components/Calendar';
import Story from '../components/Story';
import 'react-tabs/style/react-tabs.css';
import { useNetwork } from 'wagmi';
import { useAccount } from 'wagmi';
import networkMapping from '../constants/networkMapping.json';
import loveTokenAbi from '../constants/LoveToken.json';
//import { useQuery, gql } from '@apollo/client';
import { useMoralis, useMoralisQuery } from 'react-moralis';
import { useNotification } from '@web3uikit/core';
import safeFetch from '../utils/fetchWrapper';

export const TokenContractContext = createContext();

export default function MyCollectionConnected() {
    const { address } = useAccount();
    const { chain } = useNetwork();
    const loveTokenAddress = networkMapping[chain.id].loveToken.at(-1);
    /*const { loading, error, data } = useQuery(gql`
    {
    collections(filter: {
        and: [
            { or: [ { ownerAddress: { eq: "${address}" } }, { linkedPartnerAddress: { eq: "${address}" } } ] },
            { active: { eq: true } }
        ]
    }, orderBy: timestamp, orderDirection: desc) {
        id
        timestamp
        name
        tokens {
            id
            tags
            ownerAddress
            uri
        }
        profile
        ownerAddress
        linkedPartnerAddress
    }
    }
    `);*/
    /*const { data, isFetching, error } = useMoralisQuery('Collection', async query => {
        return await query.filter(collection => {
            return collection.attributes.ownerAddress === address.toLowerCase() || collection.attributes.linkedPartnerAddress === address.toLowerCase();
        });
    });*/
    const { data: ownedCollections, error: ownedCollectionsError } = useMoralisQuery('Collection', query => query.equalTo('ownerAddress', address.toLowerCase()));
    const { data: linkedCollections, error: linkedCollectionsError } = useMoralisQuery('Collection', query => query.equalTo('linkedPartnerAddress', address.toLowerCase()));
    const dispatch = useNotification();
    if (ownedCollectionsError) {
        dispatch({ type: 'error', message: JSON.stringify(ownedCollectionsError), title: 'Failed to fetch images', position: 'topL' });
    }
    if (linkedCollectionsError) {
        dispatch({ type: 'error', message: JSON.stringify(linkedCollectionsError), title: 'Failed to fetch images', position: 'topL' });
    }

    /*if (ownedCollections.length || linkedCollections.length) {
        const { data: linkedCollections, error: linkedCollectionsError } = useMoralisQuery('Collection', query => query.equalTo('linkedPartnerAddress', address.toLowerCase()));
    }*/

    const [allOwnedImageTokens, setAllOwnedImageTokens] = useState(null);
    const [allOwnedEventTokens, setAllOwnedEventTokens] = useState(null);
    const [selectedCollection, setSelectedCollection] = useState(null);
    if (data?.collections && selectedCollection === null) {
        setSelectedCollection(data.collections[0]);
    }

    useEffect(() => {
        if (selectedCollection) {
            const fetchTokensMetadata = async tokens => {
                const imageTokens = [];
                const eventTokens = [];
                await Promise.all(tokens.map(async ({ id, tags, uri }) => {
                    const tokenUri = uri.replace('ipfs://', 'https://ipfs.io/ipfs/');
                    const tokenMetadata = await safeFetch(fetch(tokenUri));
                    if (tokenMetadata.image) {
                        const imageUri = tokenMetadata.image.replace('ipfs://', 'https://ipfs.io/ipfs/');
                        imageTokens.push({ id, imageUri, tags });
                    } else if (tokenMetadata?.attributes?.eventDate) {
                        eventTokens.push({ id, title: tokenMetadata.name, start: tokenMetadata.attributes.eventDate, allDay: true });
                    }
                }));
                return { imageTokens, eventTokens };
            };
            const ownedCollectionTokens = selectedCollection.tokens.filter(({ ownerAddress, uri }) => {
                return (ownerAddress === selectedCollection.ownerAddress || ownerAddress === selectedCollection.linkedPartnerAddress) && uri.startsWith('ipfs://');
            });
            fetchTokensMetadata(ownedCollectionTokens).then(({ imageTokens, eventTokens }) => {
                setAllOwnedImageTokens(imageTokens);
                setAllOwnedEventTokens(eventTokens);
            }).catch(error => console.log(`Error fetching metadata from IPFS ${error}`));
        }
    }, [selectedCollection]);

    return (
        <TokenContractContext.Provider value={{ loveTokenAddress, loveTokenAbi }}>
            <div className='mt-10'>
                <MintBanner collections={data?.collections} />
            </div>
            <div className='m-10'>
                <Tabs selectedTabClassName='text-crimsonRed font-bold selected-tab'>
                    <TabList>
                        <Tab>Story</Tab>
                        <Tab>Calendar</Tab>
                    </TabList>
                    <TabPanel>
                        <div className='mt-4'>
                            {(allOwnedImageTokens === null || data?.collections === undefined) ? <div className='flex justify-center mt-8'><div className='loader'></div></div> :
                                <Story collections={data.collections} selectedCollection={selectedCollection} setSelectedCollection={setSelectedCollection} allOwnedImageTokens={allOwnedImageTokens} />}
                        </div>
                    </TabPanel>
                    <TabPanel>
                        {(allOwnedEventTokens === null || data?.collections === undefined) ? <div className='flex justify-center mt-8'><div className='loader'></div></div> :
                            <div className='mt-6'><Calendar collections={data.collections} allOwnedEventTokens={allOwnedEventTokens} /></div>}
                    </TabPanel>
                </Tabs>
            </div>
        </TokenContractContext.Provider>
    );
}
