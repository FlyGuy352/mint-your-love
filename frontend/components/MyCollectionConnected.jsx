import { createContext, useEffect, useState } from 'react';
import MintBanner from '../components/MintBanner';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Calendar from '../components/Calendar';
import Story from '../components/Story';
import 'react-tabs/style/react-tabs.css';
import { useNetwork } from 'wagmi';
import networkMapping from '../constants/networkMapping.json';
import loveTokenAbi from '../constants/LoveToken.json';
//import { useQuery, gql } from '@apollo/client';
import safeFetch from '../utils/fetchWrapper';
import { useTokenCollections } from '../hooks/tokenCollections';

export const TokenContractContext = createContext();

export default function MyCollectionConnected() {
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

    const { collections } = useTokenCollections();

    /*if (ownedCollections.length || linkedCollections.length) {
        const { data: linkedCollections, error: linkedCollectionsError } = useMoralisQuery('Collection', query => query.equalTo('linkedPartnerAddress', address.toLowerCase()));
    }*/

    const [allOwnedImageTokens, setAllOwnedImageTokens] = useState(null);
    const [allOwnedEventTokens, setAllOwnedEventTokens] = useState(null);
    const [selectedCollection, setSelectedCollection] = useState(null);
    if (collections && selectedCollection === null) {
        setSelectedCollection(collections[0]);
    }

    useEffect(() => {
        if (selectedCollection) {
            const fetchTokensMetadata = async tokens => {
                const imageTokens = [];
                const eventTokens = [];
                await Promise.all(tokens.map(async ({ objectid, tags, uri }) => {
                    console.log('uri ', uri)
                    const tokenUri = uri.replace('ipfs://', 'https://ipfs.io/ipfs/');
                    try {
                        const tokenMetadata = await safeFetch(fetch(tokenUri, { signal: AbortSignal.timeout(15000) }));
                        console.log('tokenMetadata ', tokenMetadata)
                        if (tokenMetadata.image) {
                            const imageUri = tokenMetadata.image.replace('ipfs://', 'https://ipfs.io/ipfs/');
                            imageTokens.push({ objectid, imageUri, tags });
                        } else if (tokenMetadata?.attributes?.eventDate) {
                            eventTokens.push({ objectid, title: tokenMetadata.name, start: tokenMetadata.attributes.eventDate, allDay: true });
                        }
                    } catch (error) {
                        if (error.name === 'AbortError') {
                            console.log('Aborting long IPFS request...');
                        } else {
                            throw error;
                        }
                    }
                }));
                return { imageTokens, eventTokens };
            };
            const ownedCollectionTokens = selectedCollection.tokens.filter(({ ownerAddress, uri }) => {
                return /*(ownerAddress === selectedCollection.ownerAddress || ownerAddress === selectedCollection.linkedPartnerAddress) &&*/ uri.startsWith('ipfs://');
            });
            fetchTokensMetadata(ownedCollectionTokens).then(({ imageTokens, eventTokens }) => {
                setAllOwnedImageTokens(imageTokens);
                setAllOwnedEventTokens(eventTokens);
            }).catch(error => console.log(`Error fetching metadata from IPFS ${error}`));
        } else if (selectedCollection === undefined) {
            setAllOwnedImageTokens(undefined);
            setAllOwnedEventTokens(undefined);
        }
        console.log('selectedCollection ', selectedCollection)
    }, [selectedCollection]);

    return (
        <TokenContractContext.Provider value={{ loveTokenAddress, loveTokenAbi }}>
            <div className='mt-10'>
                <MintBanner collections={collections} />
            </div>
            <div className='m-10'>
                <Tabs selectedTabClassName='text-crimsonRed font-bold selected-tab'>
                    <TabList>
                        <Tab>Story</Tab>
                        <Tab>Calendar</Tab>
                    </TabList>
                    <TabPanel>
                        <div className='mt-4'>
                            {(allOwnedImageTokens === null || !collections) ? <div className='flex justify-center mt-8'><div className='loader'></div></div> :
                                <Story collections={collections} selectedCollection={selectedCollection} setSelectedCollection={setSelectedCollection} allOwnedImageTokens={allOwnedImageTokens} />}
                        </div>
                    </TabPanel>
                    <TabPanel>
                        {(allOwnedEventTokens === null || !collections) ? <div className='flex justify-center mt-8'><div className='loader'></div></div> :
                            <div className='mt-6'><Calendar collections={collections} allOwnedEventTokens={allOwnedEventTokens} /></div>}
                    </TabPanel>
                </Tabs>
            </div>
        </TokenContractContext.Provider>
    );
}
