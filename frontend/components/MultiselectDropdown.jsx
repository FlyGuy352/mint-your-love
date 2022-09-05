export default function MultiselectDropdown({ optionState, title, setState }) {

    const selectAll = () => {
        const clone = { ...optionState };
        Object.keys(clone[title.toLowerCase()]).forEach(key => {
            clone[title.toLowerCase()][key].selected = true;
        });
        setState(clone);
    };

    const onSelectionChange = name => {
        const clone = { ...optionState };
        clone[title.toLowerCase()][name].selected = !clone[title.toLowerCase()][name].selected;
        setState(clone);
    };

    return (
        <div className='bg-white border border-gray-300 pt-2 divide-y divide-gray-100 w-60 z-40 absolute opacity-100 rounded-md mt-1'>
            <div className='px-3'>
                <div className='flex items-center justify-between mb-2'>
                    <p className='text-xs font-medium'>{title}</p>
                    <p className='text-xs font-medium cursor-pointer' onClick={selectAll}>Select all</p>
                </div>
            </div>
            {
                Object.entries(optionState[title.toLowerCase()]).map(([key, option]) => {
                    return (
                        <div key={key} className='flex items-center px-3 py-2 text-sm cursor-pointer hover:bg-gray-200' onClick={() => onSelectionChange(key)}>
                            <input type='checkbox' className='accent-crimsonRed cursor-pointer' checked={option.selected} />
                            <span className='px-2 tracking-wide'>{option.label}</span>
                        </div>
                    );
                })
            }
        </div>
    );
};
