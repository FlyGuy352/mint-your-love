export default function MyCollectionWrongChain() {
    return (
        <div className='w-96 min-w-[20vw] h-[75vh] min-h-[350px] bg-heartbreak_2 bg-cover bg-center flex flex-col justify-center gap-5 my-10 p-8 transparent-background mx-auto'>
            <div className='text-[max(calc(1vh+1vw+10px),1.5rem)] font-bold flex flex-col gap-10'>
                <p>Oops! It looks like your wallet is on an unsupported chain.</p>
                <p>Change it to BSC Testnet or Polygon Mumbai to start minting your love on-chain.</p>
            </div>
        </div >
    );
};