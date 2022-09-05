import { useState } from 'react';
import { AiFillFunnelPlot, AiFillCaretDown, AiOutlineSearch } from 'react-icons/ai';
import { HiFire } from 'react-icons/hi';
import LinkPartnerModal from './LinkPartnerModal';
import MigrateCollectionModal from './MigrateCollectionModal';
import BurnCollectionModal from './BurnCollectionModal';

export default function Story() {
    const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
    const [isMigrateModalOpen, setIsMigrateModalOpen] = useState(false);
    const [isBurnModalOpen, setIsBurnModalOpen] = useState(false);

    return (
        <div>
            <div className='flex flex-col md:flex-row justify-between text-sm gap-x-80 gap-y-2'>
                <div className='flex items-center grow gap-3'>
                    <div className='flex items-center'>
                        <button className='bg-crimsonRed p-1'>
                            <AiFillFunnelPlot color='white' size={18} />
                        </button>
                    </div>
                    <div className='grow flex'>
                        <div className='relative rounded-tl-lg rounded-bl-lg border border-darkPink bg-white grow focus-within:ring-2 focus-within:ring-darkPink transition ease-in-out duration-300'>
                            <input type='search' className='w-full focus:outline-none p-2 text-gray-900 rounded-lg disable-cross' placeholder='Keywords' required='' />
                            <div className='absolute right-2.5 bottom-2.5 cursor-pointer'>
                                <AiFillCaretDown color='#E75480' size={16} />
                            </div>
                        </div>
                        <button className='px-2 border-y border-r border-darkPink rounded-tr-lg rounded-br-lg bg-white'>
                            <div className='h-full flex items-center'><AiOutlineSearch color='#E75480' size={18} /></div>
                        </button>
                    </div>
                </div>
                <div className='flex grow justify-end'>
                    <button className='grow md:grow-0 p-2 border-r border-white rounded-tl-lg rounded-bl-lg bg-crimsonRed text-white font-bold' onClick={() => setIsLinkModalOpen(true)}>
                        Link Partner
                </button>
                    <button className='grow md:grow-0 p-2 border-r border-white bg-crimsonRed text-white font-bold' onClick={() => setIsMigrateModalOpen(true)}>
                        Migrate Collection
                    </button>
                    <button className='px-2 rounded-tr-lg rounded-br-lg bg-crimsonRed' onClick={() => setIsBurnModalOpen(true)}>
                        <div className='h-full flex items-center'><HiFire color='white' /></div>
                    </button>
                </div>
            </div>
            {isLinkModalOpen && <LinkPartnerModal setIsOpen={setIsLinkModalOpen} />}
            {isMigrateModalOpen && <MigrateCollectionModal setIsOpen={setIsMigrateModalOpen} />}
            {isBurnModalOpen && <BurnCollectionModal setIsOpen={setIsBurnModalOpen} />}
        </div>
    );
};
