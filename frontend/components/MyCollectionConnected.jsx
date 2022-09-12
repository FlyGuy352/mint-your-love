import { createContext } from 'react';
import MintBanner from '../components/MintBanner';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Calendar from '../components/Calendar';
import Story from '../components/Story';
import 'react-tabs/style/react-tabs.css';
import { useMoralis } from 'react-moralis';
import networkMapping from '../constants/networkMapping.json';
import loveTokenAbi from '../constants/LoveToken.json';
import { useQuery, gql } from '@apollo/client';

export const TokenContractContext = createContext();

export default function MyCollectionConnected() {
    const { account, chainId } = useMoralis();
    const chainString = chainId ? parseInt(chainId).toString() : '31337';
    const loveTokenAddress = networkMapping[chainString].loveToken.at(-1);
    const { loading, error, data } = useQuery(gql`
    {
    collections(filter: {
        and: [
            { or: [ { ownerAddress: { eq: "${account}" } }, { linkedPartnerAddress: { eq: "${account}" } } ] },
            { active: { eq: true } }
        ]
    }) {
        id
        name
        tokens {
            id
            tags
            ownerAddress
        }
        profile
        linkedPartnerAddress
    }
    }
    `);
    console.log('collections ', JSON.stringify(data?.collections))

    return (
        <div>
            <TokenContractContext.Provider value={{ loveTokenAddress, loveTokenAbi }}>
                <div className='mt-10'>
                    <MintBanner />
                </div>
                <div className='m-10'>
                    <Tabs selectedTabClassName='text-crimsonRed font-bold selected-tab'>
                        <TabList>
                            <Tab>Story</Tab>
                            <Tab>Calendar</Tab>
                        </TabList>
                        {/*loading ? <div></div> : <div></div>*/}
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
            </TokenContractContext.Provider>
        </div>
    );
}
