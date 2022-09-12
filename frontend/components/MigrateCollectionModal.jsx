import { BsFillSuitHeartFill } from 'react-icons/bs';
import Image from 'next/image';
import ethIcon from '../public/assets/icons/eth.svg';
import maticIcon from '../public/assets/icons/matic.svg';
import avaIcon from '../public/assets/icons/avax.svg';
import sklIcon from '../public/assets/icons/skl.svg';

export default function MigrateCollectionModal({ collectionId, setIsOpen }) {

    return (
        <div className='relative z-10' aria-labelledby='modal-title' role='dialog' aria-modal='true'>
            <div className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity'></div>

            <div className='fixed inset-0 z-10 overflow-y-auto'>
                <div className='flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0'>
                    <div className='relative transform overflow-hidden rounded-lg bg-lighterPink shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg'>
                        <h2 className='font-bold text-xl text-gray-700 p-4 tracking-wider'>Select Target Chain</h2>
                        <div className='p-4 mb-1'>
                            <div className='grid grid-cols-3 gap-x-4 gap-y-10 tracking-wide text-gray-700'>
                                <div className='flex gap-2'>
                                    <input type='radio' name='chain' className='accent-crimsonRed cursor-pointer' />
                                    <div className='flex items-center gap-1'><Image src={ethIcon} height={30} width={30} />Etherum</div>
                                </div>
                                <div className='flex gap-2'>
                                    <input type='radio' name='chain' className='accent-crimsonRed cursor-pointer' />
                                    <div className='flex items-center gap-1'><Image src={maticIcon} height={30} width={30} />Polygon</div>
                                </div>
                                <div className='flex gap-2'>
                                    <input type='radio' name='chain' className='accent-crimsonRed cursor-pointer' />
                                    <div className='flex items-center gap-1'><Image src={avaIcon} height={30} width={30} />Avalanche</div>
                                </div>
                                <div className='flex gap-2'>
                                    <input type='radio' name='chain' className='accent-crimsonRed cursor-pointer' />
                                    <div className='flex items-center gap-1'><Image src={sklIcon} height={30} width={30} />SKALE</div>
                                </div>
                            </div>
                        </div>
                        <div className='px-4 py-3 flex flex-col md:flex-row-reverse items-stretch justify-center sm:px-6 gap-2 mb-2'>
                            <button className='rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-1 focus:ring-red-500 flex items-center justify-center gap-1'>
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