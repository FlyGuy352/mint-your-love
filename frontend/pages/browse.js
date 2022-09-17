import { useState } from 'react';
import BrowseSearch from '../components/BrowseSearch';
import BrowseSearchMobile from '../components/BrowseSearchMobile';
import Image from 'next/image';
import mealImg from '../public/assets/images/meal.jpg';
import { useMoralisQuery } from 'react-moralis';

export default function Browse() {
    const [optionsSelected, setOptionsSelected] = useState({
        category: { meal: { label: 'Meal', selected: true }, trip: { label: 'Trip', selected: true }, others: { label: 'Others', selected: true } },
        profile: { straight: { label: 'Straight', selected: true }, sameSex: { label: 'Same-sex', selected: true }, others: { label: 'Others', selected: true } }
    });

    const { isFetching, error, data } = useMoralisQuery('Token', query => query.limit(10));
    console.log('data ', data)
    const dropdownTitle = title => {
        const options = optionsSelected[title.toLowerCase()];
        const selected = Object.values(options).filter(option => option.selected);
        const countSelected = selected.length;
        if (countSelected === Object.keys(options).length) {
            return title;
        } else if (countSelected === 1) {
            return selected[0].label;
        } else if (countSelected === 0) {
            return `No ${title.endsWith('y') ? `${title.slice(0, title.length - 1)}ies` : `${title}s`}`;
        } else {
            return `${countSelected} ${title.endsWith('y') ? `${title.slice(0, title.length - 1)}ies` : `${title}s`}`;
        }
    };

    const [timeSelected, setTimeSelected] = useState({
        'Any Time': true, 'Past Hour': false, 'Past 24 Hours': false, 'Past Week': false, 'Past Month': false, 'Past Year': false
    });

    return (
        <>
            <div className='hidden md:block mt-10'>
                <BrowseSearch optionsSelected={optionsSelected} setOptionsSelected={setOptionsSelected} timeSelected={timeSelected} setTimeSelected={setTimeSelected} dropdownTitle={dropdownTitle} />
            </div>
            <div className='md:hidden mt-10'>
                <BrowseSearchMobile optionsSelected={optionsSelected} setOptionsSelected={setOptionsSelected} timeSelected={timeSelected} setTimeSelected={setTimeSelected} dropdownTitle={dropdownTitle} />
            </div>
            <div className='pt-10 grid md:grid-cols-3 mx-auto w-4/5 gap-6'>
                <div className='flex flex-col gap-2 bg-white'>
                    <Image src={mealImg} alt='' height='305' width='428' />
                    <div className='flex items-start h-16 gap-2 px-2'>
                        <div className='font-bold text-xxs bg-lightPink py-1 px-5 rounded-full'>Meal</div>
                        <div className='font-bold text-xxs bg-lightPink py-1 px-5 rounded-full'>Alone Time</div>
                    </div>
                </div>
                <div className='flex flex-col gap-2 bg-white'>
                    <Image src={mealImg} alt='' height='305' width='428' />
                    <div className='flex items-start h-16 gap-2 px-2'>
                        <div className='font-bold text-xxs bg-lightPink py-1 px-5 rounded-full'>Meal</div>
                        <div className='font-bold text-xxs bg-lightPink py-1 px-5 rounded-full'>Alone Time</div>
                    </div>
                </div>
                <div className='flex flex-col gap-2 bg-white'>
                    <Image src={mealImg} alt='' height='305' width='428' />
                    <div className='flex items-start h-16 gap-2 px-2'>
                        <div className='font-bold text-xxs bg-lightPink py-1 px-5 rounded-full'>Meal</div>
                        <div className='font-bold text-xxs bg-lightPink py-1 px-5 rounded-full'>Alone Time</div>
                    </div>
                </div>
            </div>
        </>
    );
}