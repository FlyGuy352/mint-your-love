import { useState, useEffect } from 'react';
import { useOutsideAlerter } from '../hooks/outsideAlerter';
import { AiOutlineClose } from 'react-icons/ai';

export default function MultiTagInput() {
    const [entries, setEntries] = useState([]);

    const { visible, ref } = useOutsideAlerter(true);

    const [currentValue, setCurrentValue] = useState('');
    const handleInputChange = e => {
        setCurrentValue(e.currentTarget.value);
    }

    useEffect(() => {
        if (!visible && currentValue && !entries.includes(currentValue)) {
            setEntries([...entries, currentValue]);
            setCurrentValue('');
        }
    }, [visible]);

    return (
        <div ref={ref} className='w-full bg-white border border-blue-200 rounded-md text-sm py-1 focus:outline-none focus:ring-2 focus:ring-lightSkyBlue transition ease-in-out duration-300'>
            <ul className='flex gap-2 px-2 flex-wrap'>
                {entries.map(entry => {
                    return <li className='border border-gray-200 px-2 rounded-md flex items-center' key={entry}>
                        <span>{entry}</span><button onClick={() => setEntries(entries.filter(value => value != entry))}><AiOutlineClose color='gray' /></button>
                    </li>;
                })}
                <li className='grow text-left'><input placeholder={entries.length ? '' : 'Enter tags'} className='focus:outline-none w-full' value={currentValue} onChange={e => handleInputChange(e)} /></li>
            </ul>
        </div>
    );
};
