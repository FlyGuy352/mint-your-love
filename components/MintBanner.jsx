import { AiOutlinePlus } from 'react-icons/ai';

export default function MintBanner() {
    return (
        <div className='text-3xl w-5/6 md:3/4 lg:w-1/2 max-w-4xl mx-auto bg-white rounded-full drop-shadow-lg font-bold flex flex-col items-center p-3 font-Chewy tracking-widest gap-4'>
            <div><span className='text-crimsonRed'>Love is in the air... </span><span className='text-gray-600'>and on the chain</span></div>
            <div className='rounded-full bg-white cursor-pointer p-0.5 border-2 border-darkPink hover:border-white hover:bg-darkPink text-darkPink hover:text-white'>
                <AiOutlinePlus size={20} />
            </div>
        </div >
    );
};
