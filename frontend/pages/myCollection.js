import MyCollectionUnconnected from '../components/MyCollectionUnconnected';
import MyCollectionWrongChain from '../components/MyCollectionWrongChain';
import MyCollectionConnected from '../components/MyCollectionConnected';
import 'react-tabs/style/react-tabs.css';
import { useMoralis } from 'react-moralis';

export default function MyCollection() {
    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis();
    const supportedChains = [5];

    return (
        <>
            {isWeb3Enabled ? supportedChains.includes(parseInt(chainIdHex)) ?
                <MyCollectionConnected /> : <MyCollectionWrongChain /> : <MyCollectionUnconnected />}
        </>
    );
}
