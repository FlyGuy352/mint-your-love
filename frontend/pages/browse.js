import { useState } from 'react';
import BrowseSearch from '../components/BrowseSearch';
import BrowseSearchMobile from '../components/BrowseSearchMobile';
import Image from 'next/image';
import { useNetwork } from 'wagmi';
import { useMoralisTokens } from '../hooks/moralisData';
import { useIpfsTokens } from '../hooks/ipfsData';

export default function Browse() {
    const { chain } = useNetwork();

    const [optionsSelected, setOptionsSelected] = useState({
        category: { meal: { label: 'Meal', selected: true }, trip: { label: 'Trip', selected: true }, others: { label: 'Others', selected: true } },
        profile: { STRAIGHT: { label: 'Straight', selected: true }, SAME_SEX: { label: 'Same-sex', selected: true }, OTHERS: { label: 'Others', selected: true } }
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [searchTermUncommitted, setSearchTermUncommitted] = useState('');

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
        'Any Time': { msSinceEpoch: 'ALL', selected: true }, 'Past Hour': { msSinceEpoch: 3600000, selected: false }, 'Past 24 Hours': { msSinceEpoch: 86400000, selected: false }, 
        'Past Week': { msSinceEpoch: 604800000, selected: false }, 'Past Month': { msSinceEpoch: 2629800000, selected: false }, 'Past Year': { msSinceEpoch: 31556926000, selected: false }
    });

    const categories = Object.values(optionsSelected.category).filter(value => value.selected).map(value => value.label);
    const tags = [...categories, ...searchTerm ? [searchTerm.split(' ').filter(term => term)] : []];
    const profiles = Object.entries(optionsSelected.profile).filter(([, value]) => value.selected).map(([key]) => key);
    const timeDifferenceInMs = Object.values(timeSelected).find(({ selected }) => selected).msSinceEpoch;
    console.log('timeDifferenceInMs ', timeDifferenceInMs)

    const { data: moralisTokens, isFetching: isFetchingMoralis } = useMoralisTokens(
        chain?.id, categories.includes('Others') ? 'ALL' : tags, profiles, timeDifferenceInMs
    );
    console.log('isFetchingMoralis ', isFetchingMoralis)
    console.log('moralisTokens ', moralisTokens)
    const { data, isFetching: isFetchingIpfs } = useIpfsTokens({ browseFilters: { tags, profiles, timeDifferenceInMs }, tokens: moralisTokens });
    console.log('data ', data);
    console.log('isFetchingIpfs ', isFetchingIpfs)
    return (
        <>
            <div className='hidden md:block mt-10'>
                <BrowseSearch 
                    optionsSelected={optionsSelected} setOptionsSelected={setOptionsSelected} timeSelected={timeSelected} 
                    setTimeSelected={setTimeSelected} dropdownTitle={dropdownTitle} setSearchTerm={setSearchTerm} 
                    searchTermUncommitted={searchTermUncommitted} setSearchTermUncommitted={setSearchTermUncommitted}/>
            </div>
            <div className='md:hidden mt-10'>
                <BrowseSearchMobile
                    optionsSelected={optionsSelected} setOptionsSelected={setOptionsSelected} timeSelected={timeSelected} 
                    setTimeSelected={setTimeSelected} dropdownTitle={dropdownTitle} setSearchTerm={setSearchTerm} 
                    searchTermUncommitted={searchTermUncommitted} setSearchTermUncommitted={setSearchTermUncommitted}/>
            </div>
            <div className={`pt-10 grid mx-auto w-4/5 gap-6 ${(isFetchingMoralis || isFetchingIpfs || data.length === 0) ? 'flex justify-center' : 'md:grid-cols-3'}`}>
                {
                    isFetchingMoralis || isFetchingIpfs ? <div className='loader'></div> :
                    data.length === 0 ? <p>No Results Found</p> : 
                    data.map(({ objectid, imageUri, tags }) => {
                        return (
                            <div key={objectid} className='flex flex-col gap-2 bg-white'>
                                <Image src={imageUri} alt='' height='305' width='428' />
                                <div className='flex items-start h-16 gap-2 px-2'>
                                {tags.map(tag => <div key={tag} className='font-bold text-xxs bg-lightPink py-1 px-5 rounded-full'>{tag}</div>)}
                                </div>
                            </div>
                        );
                    })
                }
            </div>
        </>
    );
}