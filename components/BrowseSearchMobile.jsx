import { useState } from 'react';
import { AiOutlineDown, AiOutlineUp, AiOutlineClose } from 'react-icons/ai';
import { MdEvent, MdPerson } from 'react-icons/md';
import { ImHourGlass } from 'react-icons/im';
import MultiselectDropdown from './MultiselectDropdown';
import TimeDropdown from './TimeDropdown';
import { useOutsideAlerter } from '../hooks/outsideAlerter';
import { BsFilter } from 'react-icons/bs';

export default function BrowseSearch({ optionsSelected, setOptionsSelected, timeSelected, setTimeSelected, dropdownTitle }) {
    const { visible: isFilteringCategory, setVisible: setIsFilteringCategory, ref: categoryDivRef } = useOutsideAlerter(false);
    const { visible: isFilteringProfile, setVisible: setIsFilteringProfile, ref: profileDivRef } = useOutsideAlerter(false);
    const { visible: isFilteringTime, setVisible: setIsFilteringTime, ref: timeDivRef } = useOutsideAlerter(false);

    const [isFiltering, setIsFiltering] = useState(false);

    return (
        <div>
            <div className='flex flex-col gap-4 items-center'>
                <div className='relative focus-within:ring-2 focus-within:ring-darkPink rounded-lg w-5/6'>
                    <div className='flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none'>
                        <svg aria-hidden='true' className='w-5 h-5 text-gray-500' fill='none' stroke='currentColor' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'></path></svg>
                    </div>
                    <input type='search' className='focus:outline-none p-2 pl-10 w-full text-sm text-gray-900 rounded-lg border border-gray-200' placeholder='Keywords' required='' />
                </div>
                <button className='bg-crimsonRed rounded-lg text-sm px-8 py-2 font-bold w-5/6'>Search</button>
            </div>
            <div className='mt-4 border-y border-gray-200 bg-white'>
                <button className='text-sm py-2 font-bold w-full' onClick={() => setIsFiltering(true)}>
                    <div className='flex items-center justify-center gap-1'><BsFilter />More Filters</div>
                </button>
            </div>
            <div className={isFiltering ? 'fixed left-0 top-0 w-full h-screen bg-black/70 z-50' : ''}>
                <div className={
                    isFiltering ?
                        'fixed right-0 top-0 w-[75%] sm:w-[60%] h-screen bg-lighterPink p-8 ease-in duration-500' :
                        'fixed right-[-100%] top-0 p-8 ease-in duration-500'
                }>
                    <div className={isFiltering ? 'flex items-center justify-between' : 'hidden'}>
                        <h2 className='font-bold text-lg'>Filter search results</h2>
                        <div onClick={() => setIsFiltering(false)} className='rounded-full bg-white border border-gray-300 p-2 cursor-pointer shadow-md shadow-gray-400'>
                            <AiOutlineClose />
                        </div>
                    </div>
                    <div className='flex flex-col gap-5 mt-10'>
                        <div ref={categoryDivRef}>
                            <button className='w-full flex items-center bg-darkPink border border-black rounded-md text-sm py-1 tracking-wide cursor-pointer focus:outline-none focus:ring-4 focus:ring-lightPink transition ease-in-out duration-300' onClick={() => setIsFilteringCategory(!isFilteringCategory)}>
                                <div className='px-1'><MdEvent /></div><div className='mr-10'>{dropdownTitle('Category')}</div><div className='px-2 grow flex justify-end'>{isFilteringCategory ? <AiOutlineUp /> : <AiOutlineDown />}</div>
                            </button>
                            {isFilteringCategory && <MultiselectDropdown optionState={optionsSelected} title='Category' setState={setOptionsSelected} />}
                        </div>
                        <div ref={profileDivRef}>
                            <button className='w-full flex items-center bg-darkPink border border-black rounded-md text-sm py-1 tracking-wide cursor-pointer focus:outline-none focus:ring-4 focus:ring-lightPink transition ease-in-out duration-300' onClick={() => setIsFilteringProfile(!isFilteringProfile)}>
                                <div className='px-1'><MdPerson /></div><div className='mr-10'>{dropdownTitle('Profile')}</div><div className='px-2 grow flex justify-end'>{isFilteringProfile ? <AiOutlineUp /> : <AiOutlineDown />}</div>
                            </button>
                            {isFilteringProfile && <MultiselectDropdown optionState={optionsSelected} title='Profile' setState={setOptionsSelected} />}
                        </div>
                        <div ref={timeDivRef}>
                            <button className='w-full flex items-center bg-darkPink border border-black rounded-md text-sm py-1 tracking-wide cursor-pointer focus:outline-none focus:ring-4 focus:ring-lightPink transition ease-in-out duration-300' onClick={() => setIsFilteringTime(!isFilteringTime)}>
                                <div className='px-1'><ImHourGlass /></div><div className='mr-10'>{Object.entries(timeSelected).find(([, value]) => value)[0]}</div><div className='px-2 grow flex justify-end'>{isFilteringTime ? <AiOutlineUp /> : <AiOutlineDown />}</div>
                            </button>
                            {isFilteringTime && <TimeDropdown options={timeSelected} setState={setTimeSelected} />}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
