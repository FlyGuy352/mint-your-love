import MyCollectionUnconnected from '../components/MyCollectionUnconnected';
import MyCollectionWrongChain from '../components/MyCollectionWrongChain';
import MyCollectionConnected from '../components/MyCollectionConnected';
import 'react-tabs/style/react-tabs.css';
import { useAccount, useNetwork } from 'wagmi';

export default function MyCollection() {
    const supportedChains = [97, 80001];
    const { chain } = useNetwork();
    const { isConnected } = useAccount();
    return (
        <>
            {isConnected ? supportedChains.includes(chain.id) ?
                <MyCollectionConnected /> : <MyCollectionWrongChain /> : <MyCollectionUnconnected />}
        </>
    );
}
