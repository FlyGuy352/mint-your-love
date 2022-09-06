import ConnectWalletButton from './ConnectWalletButton';

export default function MyCollectionUnconnected() {
    return (
        <div className='w-96 min-w-[20vw] h-[75vh] min-h-[350px] bg-heartbreak bg-cover bg-center flex flex-col justify-between gap-5 my-10 p-8 transparent-background mx-auto'>
            <div className='text-[max(calc(1vh+1vw+10px),1.5rem)] font-bold'>
                <p>Oops! It looks like you have not yet connected your wallet.</p>
                <p className='mt-6'>Connect your wallet to start minting your love on-chain.</p>
            </div>
            <div className='text-center' id='collectionConnectWallet'>
                <ConnectWalletButton />
            </div>
        </div >
    );
};
