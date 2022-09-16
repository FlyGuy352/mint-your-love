import BrowsePage from '../components/BrowsePage';
import { useNetwork } from 'wagmi';
import { MoralisProvider } from 'react-moralis';

const APP_ID_BSC = process.env.NEXT_PUBLIC_APP_ID_BSC;
const SERVER_URL_BSC = process.env.NEXT_PUBLIC_SERVER_URL_BSC;

const APP_ID_MUMBAI = process.env.NEXT_PUBLIC_APP_ID_MUMBAI;
const SERVER_URL_MUMBAI = process.env.NEXT_PUBLIC_SERVER_URL_MUMBAI;

export default function Browse() {

    const { chain } = useNetwork();

    return (
        <MoralisProvider appId={chain?.id === 80001 ? APP_ID_MUMBAI : APP_ID_BSC} serverUrl={chain?.id === 80001 ? SERVER_URL_MUMBAI : SERVER_URL_BSC}>
            <BrowsePage />
        </MoralisProvider>
    );
}
