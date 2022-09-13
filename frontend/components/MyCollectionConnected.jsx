import { createContext, useEffect, useState } from 'react';
import MintBanner from '../components/MintBanner';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Calendar from '../components/Calendar';
import Story from '../components/Story';
import 'react-tabs/style/react-tabs.css';
import { useMoralis } from 'react-moralis';
import networkMapping from '../constants/networkMapping.json';
import loveTokenAbi from '../constants/LoveToken.json';
import { useQuery, gql } from '@apollo/client';
import { useNotification } from '@web3uikit/core';
import safeFetch from '../utils/fetchWrapper';

export const TokenContractContext = createContext();

export default function MyCollectionConnected() {
    const { account, chainId: chainIdHex } = useMoralis();
    const chainId = parseInt(chainIdHex);
    /* const supportedChains = [4];
     if (!supportedChains.includes(chainId)) {
         return <></>;
     }*/
    //const chainString = chainId ? parseInt(chainId).toString() : '31337';
    const loveTokenAddress = networkMapping[chainId].loveToken.at(-1);
    const { loading, error, data } = useQuery(gql`
    {
    collections(filter: {
        and: [
            { or: [ { ownerAddress: { eq: "${account}" } }, { linkedPartnerAddress: { eq: "${account}" } } ] },
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
    `);

    useEffect(() => {
        if (error) {
            const dispatch = useNotification();
            dispatch({ type: 'error', message: JSON.stringify(error), title: 'Failed to fetch images', position: 'topL' });
        }
    }, [error]);

    const [allOwnedImageTokens, setAllOwnedImageTokens] = useState(null);
    const [allOwnedEventTokens, setAllOwnedEventTokens] = useState(null);
    const [selectedCollection, setSelectedCollection] = useState(null);
    useEffect(() => {
        if (data?.collections && selectedCollection === null) {
            setSelectedCollection(data.collections[0]);
        }
    }, [data?.collections]);

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
                            {allOwnedImageTokens === null ? <div className='flex justify-center mt-8'><div className='loader'></div></div> :
                                <Story collections={data.collections} selectedCollection={selectedCollection} setSelectedCollection={setSelectedCollection} allOwnedImageTokens={allOwnedImageTokens} />}
                        </div>
                    </TabPanel>
                    <TabPanel>
                        {allOwnedEventTokens === null ? <div className='flex justify-center mt-8'><div className='loader'></div></div> :
                            <div className='mt-6'><Calendar collections={data.collections} allOwnedEventTokens={allOwnedEventTokens} /></div>}
                    </TabPanel>
                </Tabs>
            </div>
        </TokenContractContext.Provider>
    );
}
