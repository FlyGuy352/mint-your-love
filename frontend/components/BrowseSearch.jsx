import { useState } from 'react';
import { AiOutlineDown, AiOutlineUp, AiOutlineSearch } from 'react-icons/ai';
import { MdEvent, MdPerson } from 'react-icons/md';
import { ImHourGlass } from 'react-icons/im';
import MultiselectDropdown from './MultiselectDropdown';
import TimeDropdown from './TimeDropdown';
import { useOutsideAlerter } from '../hooks/outsideAlerter';

export default function BrowseSearch({ optionsSelected, setOptionsSelected, timeSelected, setTimeSelected, dropdownTitle, searchTerm, setSearchTerm }) {
    const { visible: isFilteringCategory, setVisible: setIsFilteringCategory, ref: categoryDivRef } = useOutsideAlerter();
    const { visible: isFilteringProfile, setVisible: setIsFilteringProfile, ref: profileDivRef } = useOutsideAlerter();
    const { visible: isFilteringTime, setVisible: setIsFilteringTime, ref: timeDivRef } = useOutsideAlerter();

    const [searchTermLocal, setSearchTermLocal] = useState(searchTerm);

    const clear = () => {
        setSearchTermLocal('');
        setSearchTerm('');
    };

    const resetAll = () => {
        const cloneOptions = { ...optionsSelected };
        Object.values(cloneOptions).forEach(main => {
            Object.keys(main).forEach(sub => {
                main[sub].selected = true;
            });
        });
        setOptionsSelected(cloneOptions);

        const cloneTime = { ...timeSelected };
        Object.keys(cloneTime).forEach(key => {
            cloneTime[key] = key === 'Any Time';
        });
        setTimeSelected(cloneTime);
    };

    return (
        <div className='w-5/6 max-w-4xl mx-auto bg-white rounded-lg focus-within:ring-2 focus-within:ring-darkPink transition ease-in-out duration-300'>
            <div className='relative border-b border-crimsonRed'>
                <div className='flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none'>
                    <AiOutlineSearch color='gray' />
                </div>
                <input type='search' className='focus:outline-none p-4 pl-10 w-full text-sm text-gray-900 rounded-t-lg' placeholder='Keywords' required='' value={searchTermLocal} onChange={e => setSearchTermLocal(e.currentTarget.value)}/>
                <button className='absolute right-[12rem] bottom-2 py-2 text-gray-500 text-sm' onClick={clear}>Clear</button>
                <button className='text-white absolute right-2.5 bottom-2 bg-crimsonRed hover:bg-darkRed rounded-2xl text-sm px-8 lg:px-12 py-2 font-bold' onClick={() => setSearchTerm(searchTermLocal)}>Search</button>
            </div>
            <div className='flex gap-10 justify-between py-2 px-3 items-center text-gray-800'>
                <div className='flex gap-7'>
                    <div ref={categoryDivRef}>
                        <button className='flex items-center bg-darkPink border border-black rounded-md text-sm py-1 tracking-wide cursor-pointer focus:outline-none focus:ring-4 focus:ring-lightPink transition ease-in-out duration-300' onClick={() => setIsFilteringCategory(!isFilteringCategory)}>
                            <div className='px-1'><MdEvent /></div><div className='mr-10'>{dropdownTitle('Category')}</div><div className='px-2'>{isFilteringCategory ? <AiOutlineUp /> : <AiOutlineDown />}</div>
                        </button>
                        {isFilteringCategory && <MultiselectDropdown optionState={optionsSelected} title='Category' setState={setOptionsSelected} />}
                    </div>
                    <div ref={profileDivRef}>
                        <button className='flex items-center bg-darkPink border border-black rounded-md text-sm py-1 tracking-wide cursor-pointer focus:outline-none focus:ring-4 focus:ring-lightPink transition ease-in-out duration-300' onClick={() => setIsFilteringProfile(!isFilteringProfile)}>
                            <div className='px-1'><MdPerson /></div><div className='mr-10'>{dropdownTitle('Profile')}</div><div className='px-2'>{isFilteringProfile ? <AiOutlineUp /> : <AiOutlineDown />}</div>
                        </button>
                        {isFilteringProfile && <MultiselectDropdown optionState={optionsSelected} title='Profile' setState={setOptionsSelected} />}
                    </div>
                    <div ref={timeDivRef}>
                        <button className='flex items-center bg-darkPink border border-black rounded-md text-sm py-1 tracking-wide cursor-pointer focus:outline-none focus:ring-4 focus:ring-lightPink transition ease-in-out duration-300' onClick={() => setIsFilteringTime(!isFilteringTime)}>
                            <div className='px-1'><ImHourGlass /></div><div className='mr-10'>{Object.entries(timeSelected).find(([, value]) => value)[0]}</div><div className='px-2'>{isFilteringTime ? <AiOutlineUp /> : <AiOutlineDown />}</div>
                        </button>
                        {isFilteringTime && <TimeDropdown options={timeSelected} setState={setTimeSelected} />}
                    </div>
                </div>
                <div className='text-sm text-gray-500 cursor-pointer' onClick={resetAll}>
                    <div>Reset all</div>
                </div>
            </div>
        </div>
    );
};
