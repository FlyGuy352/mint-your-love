import { useState, useEffect } from 'react';
import { AiFillFunnelPlot, AiFillCaretDown, AiOutlineSearch } from 'react-icons/ai';
import { HiFire } from 'react-icons/hi';
import LinkPartnerModal from './LinkPartnerModal';
import MigrateCollectionModal from './MigrateCollectionModal';
import BurnCollectionModal from './BurnCollectionModal';
import MintImageModal from './MintImageModal';
import Image from 'next/image';
import safeFetch from '../utils/fetchWrapper';
import { useOutsideAlerter } from '../hooks/outsideAlerter';

export default function Story({ collections }) {
    const [selectedCollection, setSelectedCollection] = useState(collections[0]);
    const { visible: isFilteringCollection, setVisible: setIsFilteringCollection, ref: filterDivRef } = useOutsideAlerter();
    const [allOwnedCollectionTokens, setAllOwnedCollectionTokens] = useState([]);
    const [ownedCollectionTokensDisplay, setOwnedCollectionTokensDisplay] = useState([]);
    const [isMintModalOpen, setIsMintModalOpen] = useState(false);
    const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
    const [isMigrateModalOpen, setIsMigrateModalOpen] = useState(false);
    const [isBurnModalOpen, setIsBurnModalOpen] = useState(false);
    const [searchValue, setSearchValue] = useState('');

    useEffect(() => {
        const fetchTokensToDisplay = async tokens => {
            return await Promise.all(tokens.map(async ({ tags, uri }) => {
                const tokenUri = uri.replace('ipfs://', 'https://ipfs.io/ipfs/');
                const { image } = await safeFetch(fetch(tokenUri));
                const imageUri = image.replace('ipfs://', 'https://ipfs.io/ipfs/');
                return { imageUri, tags };
            }));
        };
        const ownedCollectionTokens = selectedCollection.tokens.filter(({ ownerAddress, uri }) => {
            return (ownerAddress === selectedCollection.ownerAddress || ownerAddress === selectedCollection.linkedPartnerAddress) && uri.startsWith('ipfs://');
        });
        fetchTokensToDisplay(ownedCollectionTokens).then(result => {
            setAllOwnedCollectionTokens(result);
            setOwnedCollectionTokensDisplay(result);
        }).catch(error => console.log(`Error fetching image from IPFS ${error}`));
    }, [selectedCollection]);

    const search = () => {
        const filteredTokens = allOwnedCollectionTokens.filter(({ tags }) => {
            return tags.some(tag => tag.includes(searchValue));
        });
        setOwnedCollectionTokensDisplay(filteredTokens);
    };

    return (
        <>
            {
                collections.length === 0 ?
                    <>
                        <div className='flex justify-center mt-6'>
                            <button className='px-6 py-4 relative rounded-2xl group overflow-hidden font-bold bg-white text-crimsonRed border border-crimsonRed' onClick={() => setIsMintModalOpen(true)}>
                                <span className='absolute top-0 left-0 flex w-full h-0 mb-0 transition-all duration-200 ease-out transform translate-y-0 bg-crimsonRed group-hover:h-full opacity-90'></span>
                                <span className='relative group-hover:text-white'>Mint Your First Token</span>
                            </button>
                        </div>
                        {isMintModalOpen && <MintImageModal collections={[]} setIsOpen={setIsMintModalOpen} />}
                    </> :
                    <>
                        <div className='flex flex-col md:flex-row justify-between text-sm gap-x-80 gap-y-2'>
                            <div className='flex items-center grow gap-3'>
                                <div ref={filterDivRef}>
                                    <div className='flex items-center'>
                                        <button className='bg-crimsonRed p-1' onClick={() => setIsFilteringCollection(true)}>
                                            <AiFillFunnelPlot color='white' size={18} />
                                        </button>
                                    </div>
                                    {isFilteringCollection &&
                                        <div className='flex flex-col z-40 bg-white absolute opacity-100 border border-gray-300'>
                                            {
                                                collections.map(({ id, name }) => {
                                                    return (
                                                        <div key={id} className='flex gap-1 py-2 px-1 border-y border-dashed'>
                                                            <input type='radio' name='chain' checked={id === selectedCollection.id} className='accent-crimsonRed cursor-pointer' onClick={() => setSelectedCollection(collections.find(col => col.id === id))} />
                                                            <p>{name}</p>
                                                        </div>
                                                    );
                                                })
                                            }
                                        </div>
                                    }
                                </div>
                                <div className='grow flex'>
                                    <div className='relative rounded-tl-lg rounded-bl-lg border border-darkPink bg-white grow focus-within:ring-2 focus-within:ring-darkPink transition ease-in-out duration-300'>
                                        <input type='search' className='w-full focus:outline-none p-2 text-gray-900 rounded-lg disable-cross' placeholder='Keywords' onChange={event => setSearchValue(event.currentTarget.value)} />
                                        <div className='absolute right-2.5 bottom-2.5 cursor-pointer'>
                                            <AiFillCaretDown color='#E75480' size={16} />
                                        </div>
                                    </div>
                                    <button className='px-2 border-y border-r border-darkPink rounded-tr-lg rounded-br-lg bg-white' onClick={search}>
                                        <div className='h-full flex items-center'><AiOutlineSearch color='#E75480' size={18} /></div>
                                    </button>
                                </div>
                            </div>
                            <div className='flex grow justify-end'>
                                {selectedCollection.linkedPartnerAddress === null && <button className='grow md:grow-0 p-2 border-r border-white rounded-tl-lg rounded-bl-lg bg-crimsonRed text-white font-bold' onClick={() => setIsLinkModalOpen(true)}>
                                    Link Partner
                                </button>}
                                {
                                    selectedCollection.linkedPartnerAddress !== null &&
                                    <div className='inline-flex items-center mx-5 justify-center px-2 py-1 text-xs font-bold leading-none text-[#8E53BF] bg-[#F3E8FE] rounded-full'>
                                        {`Partner: ${selectedCollection.linkedPartnerAddress.slice(0, 6)}...${selectedCollection.linkedPartnerAddress.slice(-6)}`}
                                    </div>
                                }
                                <button className='grow md:grow-0 p-2 border-r border-white bg-crimsonRed text-white font-bold' onClick={() => setIsMigrateModalOpen(true)}>
                                    Migrate Collection
                                </button>
                                <button className='px-2 rounded-tr-lg rounded-br-lg bg-crimsonRed' onClick={() => setIsBurnModalOpen(true)}>
                                    <div className='h-full flex items-center'><HiFire color='white' /></div>
                                </button>
                            </div>
                        </div>
                        <div className='pt-10 grid md:grid-cols-3 mx-auto w-4/5 gap-6'>
                            {ownedCollectionTokensDisplay.map(({ imageUri, tags }, index) => {
                                return (
                                    <div key={index} className='flex flex-col gap-2 bg-white'>
                                        <Image src={imageUri} alt='' height='305' width='428' />
                                        <div className='flex items-start h-16 gap-2 px-2'>
                                            {tags.map(tag => <div key={tag} className='font-bold text-xxs bg-lightPink py-1 px-5 rounded-full'>{tag}</div>)}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        {isLinkModalOpen && <LinkPartnerModal collectionId={selectedCollection.id} setIsOpen={setIsLinkModalOpen} />}
                        {isMigrateModalOpen && <MigrateCollectionModal collectionId={selectedCollection.id} setIsOpen={setIsMigrateModalOpen} />}
                        {isBurnModalOpen && <BurnCollectionModal collectionId={selectedCollection.id} collectionName={selectedCollection.name} setIsOpen={setIsBurnModalOpen} />}
                    </>
            }
        </>
    );
};
