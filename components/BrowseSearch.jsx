import React, { useState } from 'react';
import { AiOutlineDown, AiOutlineUp } from 'react-icons/ai';
import { MdEvent, MdPerson } from 'react-icons/md';
import { ImHourGlass } from 'react-icons/im';

export default function BrowseSearch() {

    const [isFilteringCategory, setIsFilteringCategory] = useState(false);
    const [isFilteringProfile, setIsFilteringProfile] = useState(false);
    const [isFilteringTime, setIsFilteringTime] = useState(false);

    const filterCategory = () => {
        setIsFilteringCategory(!isFilteringCategory);
        setIsFilteringProfile(false);
        setIsFilteringTime(false);
    };

    const filterProfile = () => {
        setIsFilteringProfile(!isFilteringProfile);
        setIsFilteringCategory(false);
        setIsFilteringTime(false);
    };

    const filterTime = () => {
        setIsFilteringTime(!isFilteringTime);
        setIsFilteringCategory(false);
        setIsFilteringProfile(false);
    };

    const [optionsSelected, setOptionsSelected] = useState({
        category: { meal: true, trip: true, others: true }, profile: { straight: true, homosexual: true, others: true }
    });

    const onCheckboxChange = (main, sub) => {
        const clone = { ...optionsSelected };
        const oldValue = clone[main][sub]
        clone[main][sub] = !oldValue;
        setOptionsSelected(clone);
    }

    return (
        <div className='pt-10 w-5/6 max-w-4xl mx-auto'>

            <div className='bg-white rounded-lg'>
                <div className='relative border-b border-crimsonRed'>
                    <div className='flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none'>
                        <svg aria-hidden='true' className='w-5 h-5 text-gray-500' fill='none' stroke='currentColor' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'></path></svg>
                    </div>
                    <input type='search' className='block focus:outline-none p-4 pl-10 w-full text-sm text-gray-900 rounded-t-lg' placeholder='Keywords' required='' />
                    <button className='hidden md:block absolute right-[12rem] bottom-2 py-2 text-gray-500 text-sm'>Clear</button>
                    <button className='text-white absolute right-2.5 bottom-2 bg-crimsonRed hover:bg-darkRed rounded-2xl text-sm px-6 md:px-8 lg:px-12 py-2 font-bold'>Search</button>
                </div>
                <div className='flex gap-10 justify-between py-2 px-3 items-center '>
                    <div className='flex gap-7'>
                        <div>
                            <button className='flex items-center bg-pinkishPurple border border-black rounded-md text-sm py-1 tracking-wide cursor-pointer focus:outline-none focus:ring-4 focus:ring-mediumPink transition ease-in-out duration-300' onClick={filterCategory}>
                                <div className='px-1'><MdEvent /></div><div className='mr-10'>Category</div><div className='px-2'>{isFilteringCategory ? <AiOutlineUp /> : <AiOutlineDown />}</div>
                            </button>
                            <div className={`bg-white pt-2 divide-y divide-gray-100 w-60 absolute opacity-100 rounded-lg mt-3 ${isFilteringCategory ? 'block' : 'hidden'}`}>
                                <div className='px-3'>
                                    <div className='flex items-center justify-between mb-2'>
                                        <p className='text-xs font-medium'>Category</p>
                                        <p className='text-xs font-medium cursor-pointer'>Select all</p>
                                    </div>
                                </div>
                                <div className='flex items-center px-3 py-2 text-sm'>
                                    <input type='checkbox' className='accent-crimsonRed' checked={optionsSelected.category.meal} onChange={() => onCheckboxChange('category', 'meal')} /><span className='px-2 tracking-wide'>Meal</span>
                                </div>
                                <div className='flex items-center px-3 py-2 text-sm'>
                                    <input type='checkbox' className='accent-crimsonRed' checked={optionsSelected.category.trip} onChange={() => onCheckboxChange('category', 'trip')} /><span className='px-2 tracking-wide'>Trip</span>
                                </div>
                                <div className='flex items-center px-3 py-2 text-sm'>
                                    <input type='checkbox' className='accent-crimsonRed' checked={optionsSelected.category.others} onChange={() => onCheckboxChange('category', 'others')} /><span className='px-2 tracking-wide'>Others</span>
                                </div>
                            </div>
                        </div>
                        <div>
                            <button className='flex items-center bg-pinkishPurple border border-black rounded-md text-sm py-1 tracking-wide cursor-pointer focus:outline-none focus:ring-4 focus:ring-mediumPink transition ease-in-out duration-300' onClick={filterProfile}>
                                <div className='px-1'><MdPerson /></div><div className='mr-10'>Profile</div><div className='px-2'>{isFilteringProfile ? <AiOutlineUp /> : <AiOutlineDown />}</div>
                            </button>
                            <div className={`bg-white pt-2 divide-y divide-gray-100 w-60 absolute opacity-100 rounded-lg mt-3 ${isFilteringProfile ? 'block' : 'hidden'}`}>
                                <div className='px-3'>
                                    <div className='flex items-center justify-between mb-2'>
                                        <p className='text-xs font-medium'>Profile</p>
                                        <p className='text-xs font-medium cursor-pointer'>Select all</p>
                                    </div>
                                </div>
                                <div className='flex items-center px-3 py-2 text-sm'>
                                    <input type='checkbox' className='accent-crimsonRed' checked={optionsSelected.profile.straight} onChange={() => onCheckboxChange('profile', 'straight')} /><span className='px-2 tracking-wide'>Straight</span>
                                </div>
                                <div className='flex items-center px-3 py-2 text-sm'>
                                    <input type='checkbox' className='accent-crimsonRed' checked={optionsSelected.profile.homosexual} onChange={() => onCheckboxChange('profile', 'homosexual')} /><span className='px-2 tracking-wide'>Homosexual</span>
                                </div>
                                <div className='flex items-center px-3 py-2 text-sm'>
                                    <input type='checkbox' className='accent-crimsonRed' checked={optionsSelected.profile.others} onChange={() => onCheckboxChange('profile', 'others')} /><span className='px-2 tracking-wide'>Others</span>
                                </div>
                            </div>
                        </div>
                        <div>
                            <button className='flex items-center bg-pinkishPurple border border-black rounded-md text-sm py-1 tracking-wide cursor-pointer focus:outline-none focus:ring-4 focus:ring-mediumPink transition ease-in-out duration-300' onClick={filterTime}>
                                <div className='px-1'><ImHourGlass /></div><div className='mr-10'>Time</div><div className='px-2'>{isFilteringTime ? <AiOutlineUp /> : <AiOutlineDown />}</div>
                            </button>
                        </div>
                    </div>
                    <div className='text-sm text-gray-500 cursor-pointer'>
                        <div>Clear all</div>
                    </div>
                </div>
            </div>
        </div >
    );
};
