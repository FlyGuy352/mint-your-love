import { TiTick } from 'react-icons/ti';

export default function TimeDropdown({ options, setState }) {

    const onSelectionChange = name => {
        const clone = { ...options };
        Object.keys(clone).forEach(key => {
            clone[key].selected = key === name;
        });
        setState(clone);
    }

    return (
        <div className='bg-white border border-gray-300 divide-y divide-gray-100 w-60 z-40 absolute opacity-100 rounded-md mt-1'>
            {
                Object.entries(options).map(([key, value]) => {
                    return (
                        <div key={key} className='grid grid-cols-10 px-3 py-2 text-sm cursor-pointer hover:bg-gray-200' onClick={() => onSelectionChange(key)}>
                            <div className=''><div className='flex items-center h-full'>{value.selected && <TiTick size={15} />}</div></div>
                            <div className='col-span-9'><span className='tracking-wide'>{key}</span></div>
                        </div>
                    );
                })
            }
        </div>
    );
};
