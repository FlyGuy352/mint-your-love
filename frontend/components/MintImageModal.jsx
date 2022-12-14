import { useState, useContext } from 'react';
import { AiOutlineDown } from 'react-icons/ai';
import { GiRelationshipBounds } from 'react-icons/gi';
import { BsFillSuitHeartFill } from 'react-icons/bs';
import { useOutsideAlerter } from '../hooks/outsideAlerter';
import ImageUpload from './ImageUpload';
import ChooseCollectionDropdown from './ChooseCollectionDropdown';
import MultiTagInput from './MultiTagInput';
import { TokenContractContext } from './MyCollectionConnected';
import { useContract, useSigner, useNetwork, useAccount } from 'wagmi';
import { useNotification } from '@web3uikit/core';
import safeFetch from '../utils/fetchWrapper';
import { useMutation, useQueryClient } from 'react-query';
import { customError } from '../utils/workWithNativeTypes';

export default function MintImageModal({ collections, setIsOpen }) {
    const { chain } = useNetwork();
    const { address } = useAccount();
    const lowerCaseAddress = address.toLowerCase();

    const [file, setFile] = useState(null);
    const { visible: isChoosingCollection, setVisible: setIsChoosingCollection, ref: chooseCollectionDiv } = useOutsideAlerter();
    const { visible: isChoosingProfile, setVisible: setIsChoosingProfile, ref: chooseProfileDiv } = useOutsideAlerter();
    const [collectionId, setCollectionId] = useState(undefined);
    const [collectionName, setCollectionName] = useState('Choose a collection');
    const [newCollectionName, setNewCollectionName] = useState('');
    const profileOptions = ['Straight', 'Same-sex', 'Others'];
    const [profileName, setProfileName] = useState('Relationship profile');
    const [tags, setTags] = useState([]);
    const [isCommitting, setIsCommitting] = useState(false);
    const { loveTokenAddress, loveTokenAbi } = useContext(TokenContractContext);
    const loveToken = useContract({ addressOrName: loveTokenAddress, contractInterface: loveTokenAbi, signerOrProvider: useSigner().data });
    const dispatch = useNotification();

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

    const validate = () => {
        if (file === null) {
            return dispatch({ type: 'error', message: 'Please upload a file', title: 'Missing required fields', position: 'topR' });
        }
        if (collectionId === undefined) {
            return dispatch({ type: 'error', message: 'Please select a collection', title: 'Missing required fields', position: 'topR' });
        }
        if (collectionId === null && newCollectionName === '') {
            return dispatch({ type: 'error', message: 'Please enter a new collection name', title: 'Missing required fields', position: 'topR' });
        }
        if (collectionId === null && profileName === 'Relationship profile') {
            return dispatch({ type: 'error', message: 'Please select a relationship profile', title: 'Missing required fields', position: 'topR' });
        }
        return true;
    };

    const commit = async () => {
        setIsCommitting(true);

        const formData = new FormData();
        formData.append('name', 'Love Token Photo');
        formData.append('description', collectionId === null ? newCollectionName : collectionName);
        tags.forEach((tag, index) => formData.append(`tag${index}`, tag));
        formData.append('file', file);

        try {
            const { success, jsonHash, imgHash, error } = await safeFetch(fetch('/api/pinToIpfs', { method: 'post', body: formData }));
            if (success) {
                try {
                    const tx = collectionId === null ? await loveToken.mintNewCollection(`ipfs://${jsonHash}`, newCollectionName, profileOptions.indexOf(profileName), tags) :
                        await loveToken.mintExistingCollection(`ipfs://${jsonHash}`, collectionId, tags);
                    const receipt = await tx.wait();
                    dispatch({
                        type: 'success',
                        message: 'NFT minted',
                        title: 'You have minted an NFT of your cherished memory',
                        position: 'topR'
                    });
                    if (collectionId === null) {
                        const collectionCreatedEventArgs = receipt.events[0].args;
                        const nftMintedEventArgs = receipt.events[2].args;
                        return {
                            name: collectionCreatedEventArgs.name, tokenId: nftMintedEventArgs.tokenId.toString(), collectionId: nftMintedEventArgs.collectionId.toString(), 
                            imageUri: `https://ipfs.io/ipfs/${imgHash}`, jsonUri: `https://ipfs.io/ipfs/${jsonHash}`
                        };
                    } else {
                        const nftMintedEventArgs = receipt.events[1].args;
                        return { 
                            tokenId: nftMintedEventArgs.tokenId.toString(), collectionId: nftMintedEventArgs.collectionId.toString(), 
                            imageUri: `https://ipfs.io/ipfs/${imgHash}`, jsonUri: `https://ipfs.io/ipfs/${jsonHash}`
                        };
                    }
                } catch (error) {
                    throw customError('Failed to mint NFT', error.message);
                }
            } else {
                throw customError('Failed to pin NFT to IPFS', error);
            }
        } catch (error) {
            throw customError('Failed to fetch pinning endpoint', error.message);
        }
    };

    const queryClient = useQueryClient();
    const mutation = useMutation(commit, {
        onError: error => {
            dispatch({ type: 'error', message: error.message, title: error.name, position: 'topR' });
        },
        onSettled: () => setIsCommitting(false),
        onSuccess: newData => {
            queryClient.setQueryData(['collections', { chainId: chain.id, address: lowerCaseAddress }], oldData => {
                const newToken = { objectid: newData.tokenId, collectionId: newData.collectionId, ownerAddress: lowerCaseAddress, tags, uri: newData.jsonUri };
                if (collectionId === null) {
                    return [{ objectid: newData.collectionId, name: newData.name, ownerAddress: lowerCaseAddress, tokens: [newToken] }, ...oldData];
                } else {
                    const collection = oldData.find(({ objectid }) => objectid === collectionId);
                    const newCollection = { ...collection, tokens: [newToken, ...collection.tokens] };
                    const newData = JSON.parse(JSON.stringify(oldData));
                    newData[oldData.indexOf(collection)] = newCollection;
                    return newData;
                }
            });            

            queryClient.setQueryData(['tokens', 'ipfs', chain.id, newData.collectionId], oldData => {
                return {
                    eventTokens: oldData?.eventTokens || [],
                    imageTokens: [{ objectid: newData.tokenId, imageUri: newData.imageUri, tags }, ...oldData? [...oldData.imageTokens] : []]
                };
            });
            setIsOpen(false);
        }
    });

    return (
        <div className='relative z-10' aria-labelledby='modal-title' role='dialog' aria-modal='true'>
            <div className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity'></div>
            <div className='fixed inset-0 z-10 overflow-y-auto'>
                <div className='flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0'>
                    <div className='min-h-[80vh] relative transform overflow-hidden rounded-lg bg-lighterPink shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg'>
                        {(isCommitting || collections === undefined) && <div className='w-full absolute min-h-[80vh] h-full bg-white/70 z-50 flex items-center justify-center'><div className='loader'></div></div>}
                        <div className='px-4 pt-5 pb-4 sm:p-6'>
                            <div className='flex flex-col gap-4'>
                                <div>
                                    <p className='font-bold text-xl text-gray-700'>Upload image</p>
                                    <p className='text-gray-500 text-xs mb-3'>PNG and JPG files are allowed</p>
                                </div>
                                <ImageUpload file={file} setFile={setFile} />
                                <ChooseCollectionDropdown collections={collections} collectionName={collectionName} divRef={chooseCollectionDiv} isChoosingCollection={isChoosingCollection} setIsChoosingCollection={setIsChoosingCollection} handleCollectionClick={handleCollectionClick} />
                                <div>
                                    <MultiTagInput tags={tags} setTags={setTags} />
                                </div>

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
                                                                <div key={option} className='flex items-center py-1 cursor-pointer hover:bg-lightPink' onClick={() => handleProfileClick(option)}>
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
                        <div className='px-4 py-3 flex flex-col md:flex-row-reverse items-stretch justify-center sm:px-6 gap-2'>
                            <button className='rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-1 focus:ring-red-500 flex items-center justify-center gap-1' onClick={() => validate() && mutation.mutate()}>
                                Commit <BsFillSuitHeartFill />
                            </button>
                            <button className='rounded-md border border-gray-400 bg-white px-4 py-2 text-sm font-medium text-gray-600 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-indigo-500' onClick={() => setIsOpen(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}