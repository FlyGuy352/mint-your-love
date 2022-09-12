import { useEffect } from 'react';
import MyCollectionUnconnected from '../components/MyCollectionUnconnected';
import MyCollectionConnected from '../components/MyCollectionConnected';
import 'react-tabs/style/react-tabs.css';
import { useMoralis } from 'react-moralis';
import listTokensOfOwner from '../utils/listTokensOfOwner.js';

export default function MyCollection() {
    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis();
    const chainId = parseInt(chainIdHex);

    useEffect(() => {
        if (isWeb3Enabled) {
            console.log('web 3 enabled');
        }
    }, [isWeb3Enabled]);

    return (
        <>
            {isWeb3Enabled ? <MyCollectionConnected /> : <MyCollectionUnconnected />}
        </>
    );
}
