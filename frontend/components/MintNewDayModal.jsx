import { useState, useContext } from 'react';
import { AiOutlineDown } from 'react-icons/ai';
import { GiRelationshipBounds } from 'react-icons/gi';
import { BsFillSuitHeartFill } from 'react-icons/bs';
import { useOutsideAlerter } from '../hooks/outsideAlerter';
import { TokenContractContext } from './MyCollectionConnected';
import { useWeb3Contract } from 'react-moralis';
import { useNotification } from '@web3uikit/core';
import safeFetch from '../utils/fetchWrapper';
import ChooseCollectionDropdown from './ChooseCollectionDropdown';

export default function MintNewDayModal({ collections, setIsOpen }) {

    const [eventDate, setEventDate] = useState(null);
    const [title, setTitle] = useState(false);
    const [description, setDescription] = useState(false);
    const { visible: isChoosingCollection, setVisible: setIsChoosingCollection, ref: chooseCollectionDiv } = useOutsideAlerter();
    const { visible: isChoosingProfile, setVisible: setIsChoosingProfile, ref: chooseProfileDiv } = useOutsideAlerter();
    const [collectionId, setCollectionId] = useState(undefined);
    const [collectionName, setCollectionName] = useState('Choose a collection');
    const [newCollectionName, setNewCollectionName] = useState('');
    const profileOptions = ['Straight', 'Same-sex', 'Others'];
    const [profileName, setProfileName] = useState('Relationship profile');
    const [isCommitting, setIsCommitting] = useState(false);
    const { loveTokenAddress, loveTokenAbi } = useContext(TokenContractContext);

    const handleCollectionClick = (id, name) => {
        if (id === undefined) {
            setCollectionId(null);
            setCollectionName('Adding New Collection');
        } else {
            setCollectionId(id);
            setCollectionName(name);
        }
        setIsChoosingCollection(false);
    };

    const handleProfileClick = profile => {
        setProfileName(profile);
        setIsChoosingProfile(false);
    };

    const dispatch = useNotification();
    const handleMintNftSuccess = async tx => {
        await tx.wait(1);
        dispatch({
            type: 'success',
            message: 'NFT minted',
            title: 'You have minted an NFT of your cherished memory',
            position: 'topR'
        });
        setIsOpen(false);
    };
    const handleMintNftError = error => {
        dispatch({
            type: 'error',
            message: 'Failed to mint NFT',
            title: JSON.stringify(error),
            position: 'topR'
        });
        setIsCommitting(false);
    };
    const { runContractFunction } = useWeb3Contract();

    const validate = () => {
        if (eventDate === null) {
            return dispatch({ type: 'error', message: 'Please indicate a date', title: 'Missing required fields', position: 'topR' });
        }
        return true;
    };

    const commit = async () => {
        if (validate() === true) {
            setIsCommitting(true);

            const formData = new FormData();
            formData.append('name', title);
            formData.append('description', description);
            formData.append('date', eventDate);

            try {
                const data = await safeFetch(fetch('/pinNftToIpfs', { method: 'post', body: formData }));
                if (data.success) {
                    for (const ipfsHash of data.ipfsHashes) {
                        await runContractFunction({
                            params: {
                                abi: loveTokenAbi,
                                contractAddress: loveTokenAddress,
                                functionName: collectionId === null ? 'mintNewCollection' : 'mintExistingCollection',
                                params: {
                                    uri: `ipfs://${ipfsHash}`, tags: [],
                                    ...collectionId === null ? { name: newCollectionName, profile: profileOptions.indexOf(profileName) } : { collectionId }
                                }
                            },
                            onSuccess: handleMintNftSuccess,
                            onError: handleMintNftError
                        });
                    }
                } else {
                    dispatch({ type: 'error', message: JSON.stringify(data.error), title: 'Failed to pin NFT to IPFS', position: 'topR' });
                    setIsCommitting(false);
                }
            } catch (error) {
                dispatch({ type: 'error', message: JSON.stringify(error), title: 'Failed to fetch pinning endpoint', position: 'topR' });
                setIsCommitting(false);
            }
        }
    };

    return (
        <div className='relative z-10' aria-labelledby='modal-title' role='dialog' aria-modal='true'>
            <div className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity'></div>
            <div className='fixed inset-0 z-10 overflow-y-auto'>
                <div className='flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0'>
                    <div className='min-h-[80vh] relative transform overflow-hidden rounded-lg bg-lighterPink shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg'>
                        {isCommitting && <div className='min-h-[80vh] w-full absolute h-full bg-white/70 z-50 flex items-center justify-center'><div className='loader'></div></div>}
                        <div className='px-4 pt-5 pb-4 sm:py-4 sm:px-5'>
                            <div className='flex flex-col gap-4'>
                                <p className='font-bold text-xl text-gray-700'>Commemorate Special Day</p>
                                <div className='flex gap-8 items-center'>
                                    <span className='text-gray-700'>Date:</span>
                                    <input type='date' className='grow bg-white py-1 border border-blue-200 rounded-md focus:outline-none focus:ring-4 focus:ring-lightSkyBlue transition ease-in-out duration-300 px-2' defaultValue={new Date().toISOString().split('T')[0]} onChange={e => setEventDate(e.currentTarget.value)} ></input>
                                </div>
                                <input maxLength='100' placeholder='Title' className='bg-white py-1 border border-blue-200 rounded-md focus:outline-none focus:ring-4 focus:ring-lightSkyBlue transition ease-in-out duration-300 px-2' onChange={e => setTitle(e.currentTarget.value)} />
                                <textarea rows='5' maxLength='500' placeholder='Description' className='resize-none bg-white py-1 border border-blue-200 rounded-md focus:outline-none focus:ring-4 focus:ring-lightSkyBlue transition ease-in-out duration-300 px-2' onChange={e => setDescription(e.currentTarget.value)} />
                                <ChooseCollectionDropdown collections={collections} collectionName={collectionName} divRef={chooseCollectionDiv} isChoosingCollection={isChoosingCollection} setIsChoosingCollection={setIsChoosingCollection} handleCollectionClick={handleCollectionClick} />
                                {collectionId === null &&
                                    <div className='text-sm grid md:grid-cols-2 gap-2'>
                                        <input maxLength='100' placeholder='Collection name' className='bg-white py-1 border border-blue-200 rounded-md focus:outline-none focus:ring-4 focus:ring-lightSkyBlue transition ease-in-out duration-300 px-2' onChange={e => setNewCollectionName(e.currentTarget.value)} />
                                        <div ref={chooseProfileDiv} className='flex flex-col gap-1 text-gray-700'>
                                            <div className={`relative ${isChoosingCollection ? '-z-10' : ''}`}>
                                                <button className='w-full flex items-center justify-between bg-white border border-blue-200 rounded-md text-sm py-1 cursor-pointer focus:outline-none focus:ring-4 focus:ring-lightSkyBlue transition ease-in-out duration-300' onClick={() => setIsChoosingProfile(!isChoosingProfile)}>
                                                    <div className='flex items-center'>
                                                        <div className='px-1'><GiRelationshipBounds /></div><div>{profileName}</div>
                                                    </div>
                                                    <div className='px-2'><AiOutlineDown /></div>
                                                </button>
                                                {isChoosingProfile &&
                                                    <div className='text-sm bg-white absolute opacity:100 mt-1 w-full'>
                                                        {profileOptions.map(option => {
                                                            return (
                                                                <div className='flex items-center py-1 cursor-pointer hover:bg-lightPink' onClick={() => handleProfileClick(option)}>
                                                                    <div className='px-1'><GiRelationshipBounds /></div><div>{option}</div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                }
                            </div>
                        </div>
                        <div className='p-4 flex flex-col md:flex-row-reverse items-stretch justify-center sm:px-6 gap-2'>
                            <button className='rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-1 focus:ring-red-500 flex items-center justify-center gap-1' onClick={commit}>
                                Commit <BsFillSuitHeartFill />
                            </button>
                            <button className='rounded-md border border-gray-400 bg-white px-4 py-2 text-sm font-medium text-gray-600 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-indigo-500' onClick={() => setIsOpen(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}