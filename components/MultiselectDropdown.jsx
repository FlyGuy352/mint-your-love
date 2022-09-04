export default function MultiselectDropdown({ optionState, title, setState }) {

    const selectAll = () => {
        const clone = { ...optionState };
        Object.keys(clone[title.toLowerCase()]).forEach(key => {
            clone[title.toLowerCase()][key].selected = true;
        });
        setState(clone);
    };

    const onCheckboxChange = name => {
        const clone = { ...optionState };
        clone[title.toLowerCase()][name].selected = !clone[title.toLowerCase()][name].selected;
        setState(clone);
    }

    return (
        <div className='bg-white pt-2 divide-y divide-gray-100 w-60 z-40 absolute opacity-100 rounded-lg mt-1'>
            <div className='px-3'>
                <div className='flex items-center justify-between mb-2'>
                    <p className='text-xs font-medium'>{title}</p>
                    <p className='text-xs font-medium cursor-pointer' onClick={selectAll}>Select all</p>
                </div>
            </div>
            {
                Object.entries(optionState[title.toLowerCase()]).map(([key, option]) => {
                    return (
                        <div key={key} className='flex items-center px-3 py-2 text-sm'>
                            <input type='checkbox' className='accent-crimsonRed' checked={option.selected} onChange={() => onCheckboxChange(key)} />
                            <span className='px-2 tracking-wide'>{option.label}</span>
                        </div>
                    );
                })
            }
        </div>
    );
};
