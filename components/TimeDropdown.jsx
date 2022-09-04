import { TiTick } from 'react-icons/ti';

export default function TimeDropdown({ options, setState }) {

    const onSelectionChange = name => {
        const clone = { ...options };
        Object.keys(clone).forEach(key => {
            clone[key] = key === name;
        });
        setState(clone);
    }

    return (
        <div className='bg-white divide-y divide-gray-100 w-60 absolute opacity-100 rounded-lg mt-1'>
            {
                Object.entries(options).map(([key, value]) => {
                    return (
                        <div key={key} className='grid grid-cols-10 px-3 py-2 text-sm cursor-pointer' onClick={() => onSelectionChange(key)}>
                            <div className=''><div className='flex items-center h-full'>{value && <TiTick size={15} />}</div></div>
                            <div className='col-span-9'><span className='tracking-wide'>{key}</span></div>
                        </div>
                    );
                })
            }
        </div>
    );
};
