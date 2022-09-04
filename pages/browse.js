import { useState } from 'react';
import BrowseSearch from '../components/BrowseSearch';
import BrowseSearchMobile from '../components/BrowseSearchMobile';
import Image from 'next/image';
import mealImg from '../public/assets/images/meal.jpg';

export default function Browse() {

    const [optionsSelected, setOptionsSelected] = useState({
        category: { meal: { label: 'Meal', selected: true }, trip: { label: 'Trip', selected: true }, others: { label: 'Others', selected: true } },
        profile: { straight: { label: 'Straight', selected: true }, homosexual: { label: 'Homosexual', selected: true }, others: { label: 'Others', selected: true } }
    });

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
        <div>
            <div className='hidden md:block'>
                <BrowseSearch optionsSelected={optionsSelected} setOptionsSelected={setOptionsSelected} timeSelected={timeSelected} setTimeSelected={setTimeSelected} dropdownTitle={dropdownTitle} />
            </div>
            <div className='md:hidden'>
                <BrowseSearchMobile optionsSelected={optionsSelected} setOptionsSelected={setOptionsSelected} timeSelected={timeSelected} setTimeSelected={setTimeSelected} dropdownTitle={dropdownTitle} />
            </div>
        </div>
    )
}
