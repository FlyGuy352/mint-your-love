import { BsFillSuitHeartFill } from 'react-icons/bs';
import { useContext, useState } from 'react';
import { useNotification } from '@web3uikit/core';
import { TokenContractContext } from './MyCollectionConnected';
import { usePrepareContractWrite, useContractWrite } from 'wagmi';

export default function LinkPartnerModal({ collectionId, setIsOpen }) {

    const { loveTokenAddress, loveTokenAbi } = useContext(TokenContractContext);
    const [partnerAddress, setPartnerAddress] = useState('');

    const { config } = usePrepareContractWrite({
        addressOrName: loveTokenAddress,
        contractInterface: loveTokenAbi,
        functionName: 'linkLover',
        args: [partnerAddress, collectionId]
    });
    const { error, isError, isSuccess, write } = useContractWrite(config);

    const [isCommitting, setIsCommitting] = useState(false);

    const dispatch = useNotification();
    if (isError) {
        dispatch({
            type: 'error',
            message: 'Failed to link lover',
            title: JSON.stringify(error),
            position: 'topR'
        });
        setIsCommitting(false);
    } else if (isSuccess) {
        dispatch({
            type: 'success',
            message: 'Lover linked',
            title: 'You have linked your partner to view this collection',
            position: 'topR'
        });
        setIsOpen(false);
    }

    const commit = () => {
        setIsCommitting(true);
        write();
    };

    return (
        <div className='relative z-10' aria-labelledby='modal-title' role='dialog' aria-modal='true'>
            <div className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity'></div>

            <div className='fixed inset-0 z-10 overflow-y-auto'>
                <div className='flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0'>
                    <div className='relative transform overflow-hidden rounded-lg bg-lighterPink shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg'>
                        {isCommitting && <div className='w-full absolute h-full bg-white/70 z-50 flex items-center justify-center'>
                            <div className='loader'></div>
                        </div>}
                        <div className='p-4'>
                            <div className='flex flex-col items-stretch gap-4 tracking-wide text-gray-700'>
                                Enter the address of your partner to link this collection
                                <input onChange={event => setPartnerAddress(event.currentTarget.value)} placeholder='0x' className='border border-blue-200 rounded-lg p-2 focus:outline-none focus:ring-4 focus:ring-lightSkyBlue transition ease-in-out duration-300'></input>
                            </div>
                        </div>
                        <div className='px-4 py-3 flex flex-col md:flex-row-reverse items-stretch justify-center sm:px-6 gap-2 mb-2'>
                            <button className='rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-1 focus:ring-red-500 flex items-center justify-center gap-1' onClick={commit}>
                                Commit <BsFillSuitHeartFill />
                            </button>
                            <button className='rounded-md border border-gray-400 bg-white px-4 py-2 text-sm font-medium text-gray-600 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-indigo-500' onClick={() => setIsOpen(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}