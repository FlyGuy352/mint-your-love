import MyCollectionUnconnected from '../components/MyCollectionUnconnected';
import MyCollectionWrongChain from '../components/MyCollectionWrongChain';
import MyCollectionConnected from '../components/MyCollectionConnected';
import 'react-tabs/style/react-tabs.css';
import { useAccount, useNetwork } from 'wagmi';

export default function MyCollection() {
    const { chain, chains } = useNetwork();
    const { isConnected } = useAccount();
    return (
        <>
            {isConnected ? chains.map(({ id }) => id).includes(chain.id) ?
                <MyCollectionConnected /> : <MyCollectionWrongChain /> : <MyCollectionUnconnected />}
        </>
    );
}
