import { useEffect } from 'react';
import MintBanner from '../components/MintBanner';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Calendar from '../components/Calendar';
import Story from '../components/Story';
import 'react-tabs/style/react-tabs.css';
import { useMoralis } from 'react-moralis';
import listTokensOfOwner from '../utils/listTokensOfOwner';
import listLinkedCollections from '../utils/listLinkedCollections';
import queryCollectionTokens from '../utils/queryCollectionTokens';

export default function MyCollectionConnected() {
    const { account, web3, chainId } = useMoralis();
    const chainString = chainId ? parseInt(chainId).toString() : '31337';

    useEffect(() => {
        (async () => {
            const ownedTokenIds = await listTokensOfOwner(chainString, web3, account);
            const linkedCollectionIds = await listLinkedCollections(chainString, web3, account);
            const ownedAndLinkedCollections = await queryCollectionTokens(ownedTokenIds, linkedCollectionIds);
            console.log('ownedAndLinkedCollections ', ownedAndLinkedCollections)
        })();
    }, []);

    return (
        <div>
            <div className='mt-10'>
                <MintBanner />
            </div>
            <div className='m-10'>
                <Tabs selectedTabClassName='text-crimsonRed font-bold selected-tab'>
                    <TabList>
                        <Tab>Story</Tab>
                        <Tab>Calendar</Tab>
                    </TabList>

                    <TabPanel>
                        <div className='mt-2'>
                            <Story />
                        </div>
                    </TabPanel>
                    <TabPanel>
                        <Calendar />
                    </TabPanel>
                </Tabs>
            </div>
        </div>
    );
}
