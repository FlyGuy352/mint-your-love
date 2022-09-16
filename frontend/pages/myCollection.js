import MyCollectionUnconnected from '../components/MyCollectionUnconnected';
import MyCollectionWrongChain from '../components/MyCollectionWrongChain';
import MyCollectionConnected from '../components/MyCollectionConnected';
import 'react-tabs/style/react-tabs.css';
import { useAccount, useNetwork } from 'wagmi';
import { MoralisProvider } from 'react-moralis';

const APP_ID_BSC = process.env.NEXT_PUBLIC_APP_ID_BSC;
const SERVER_URL_BSC = process.env.NEXT_PUBLIC_SERVER_URL_BSC;

const APP_ID_MUMBAI = process.env.NEXT_PUBLIC_APP_ID_MUMBAI;
const SERVER_URL_MUMBAI = process.env.NEXT_PUBLIC_SERVER_URL_MUMBAI;

export default function MyCollection() {
    const supportedChains = [97, 80001];
    const { chain } = useNetwork();
    const { isConnected } = useAccount();
    return (
        <MoralisProvider appId={chain?.id === 80001 ? APP_ID_MUMBAI : APP_ID_BSC} serverUrl={chain?.id === 80001 ? SERVER_URL_MUMBAI : SERVER_URL_BSC}>
            {isConnected ? supportedChains.includes(chain.id) ?
                <MyCollectionConnected /> : <MyCollectionWrongChain /> : <MyCollectionUnconnected />}
        </MoralisProvider>
    );
}
