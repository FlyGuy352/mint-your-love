import { createContext, useState, useEffect } from 'react';
import MintBanner from '../components/MintBanner';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Calendar from '../components/Calendar';
import Story from '../components/Story';
import 'react-tabs/style/react-tabs.css';
import { useAccount, useNetwork } from 'wagmi';
import networkMapping from '../constants/networkMapping.json';
import loveTokenAbi from '../constants/LoveToken.json';
import { useMoralisCollections } from '../hooks/moralisData';
import { useIpfsTokens } from '../hooks/ipfsData';
import { usePreviousValue } from '../hooks/previousValue';

export const TokenContractContext = createContext();

export default function MyCollectionConnected() {
    const { chain } = useNetwork();
    const loveTokenAddress = networkMapping[chain.id].loveToken.at(-1);
    const { address } = useAccount();    
    const previousChainId = usePreviousValue(chain.id);
    const previousAddress = usePreviousValue(address);

    const { collections, isFetching: isFetchingMoralis } = useMoralisCollections(chain.id, address.toLowerCase());
    const previousCollectionLength = usePreviousValue(collections?.length);
    const [selectedCollection, setSelectedCollection] = useState(null);
    useEffect(() => {
        if (!selectedCollection || chain.id !== previousChainId || address !== previousAddress || collections?.length !== previousCollectionLength) {
            setSelectedCollection(collections?.[0]);
        }
    }, [collections]);

    const { data, isFetching: isFetchingIpfs } = useIpfsTokens({ chainId: chain.id, collectionId: selectedCollection?.objectid, tokens: selectedCollection?.tokens }, 10000);

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
                            {(isFetchingMoralis || isFetchingIpfs || collections === undefined || selectedCollection === null) ? <div className='flex justify-center mt-8'><div className='loader'></div></div> :
                                <Story collections={collections} selectedCollection={selectedCollection} setSelectedCollection={setSelectedCollection} imageTokens={data?.imageTokens} />}
                        </div>
                    </TabPanel>
                    <TabPanel>
                        {(isFetchingMoralis || isFetchingIpfs || collections === undefined || selectedCollection === null) ? <div className='flex justify-center mt-8'><div className='loader'></div></div> :
                            <div className='mt-6'><Calendar collections={collections} eventTokens={data?.eventTokens} /></div>}
                    </TabPanel>
                </Tabs>
            </div>
        </TokenContractContext.Provider>
    );
}
