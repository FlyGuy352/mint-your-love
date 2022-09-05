import { BsFillSuitHeartFill } from 'react-icons/bs';

export default function BurnCollectionModal({ setIsOpen }) {

    return (
        <div className='relative z-10' aria-labelledby='modal-title' role='dialog' aria-modal='true'>
            <div className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity'></div>

            <div className='fixed inset-0 z-10 overflow-y-auto'>
                <div className='flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0'>
                    <div className='relative transform overflow-hidden rounded-lg bg-lighterPink shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg'>
                        <div className='p-4'>
                            <div className='flex flex-col items-stretch gap-4 tracking-wide text-gray-700'>
                                <p>Are you sure you wish to burn this collection?</p>
                                <p>Please note that this action is <span className='font-bold'>irrevocable</span>!</p>
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