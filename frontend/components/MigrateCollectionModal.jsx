import { useContext, useState } from 'react';
import { BsFillSuitHeartFill } from 'react-icons/bs';
import Image from 'next/image';
//import ethIcon from '../public/assets/icons/eth.svg';
import maticIcon from '../public/assets/icons/matic.svg';
import bnbIcon from '../public/assets/icons/bnb.svg';
import { useNotification } from '@web3uikit/core';
import { TokenContractContext } from './MyCollectionConnected';
//import { useNetwork, usePrepareContractWrite, useContractWrite } from 'wagmi';
import { useContract, useSigner, useNetwork, useAccount } from 'wagmi';
import networkMapping from '../constants/networkMapping.json';
import { useMutation, useQueryClient } from 'react-query';
//import avaIcon from '../public/assets/icons/avax.svg';
//import sklIcon from '../public/assets/icons/skl.svg';

export default function MigrateCollectionModal({ collectionId, setIsOpen }) {

    const { chain } = useNetwork();
    const { address } = useAccount();
    const lowerCaseAddress = address.toLowerCase();

    const { loveTokenAddress, loveTokenAbi } = useContext(TokenContractContext);
    const loveToken = useContract({ addressOrName: loveTokenAddress, contractInterface: loveTokenAbi, signerOrProvider: useSigner().data });
    const supportedChains = [
        { chainId: 97, domain: 0x62732d74, icon: bnbIcon, name: 'BSC Testnet' },
        { chainId: 80001, domain: 80001, icon: maticIcon, name: 'Polygon Mumbai' }
    ];

    const [targetChain, setTargetChain] = useState(null);

    /*const { config } = usePrepareContractWrite({
        addressOrName: loveTokenAddress,
        contractInterface: loveTokenAbi,
        functionName: 'transferCollection',
        args: [targetChain?.domain, targetChain?.address, collectionId]
    });
    const { error, isError, isSuccess, write } = useContractWrite(config);*/

    const dispatch = useNotification();
    /*if (isError && isCommitting) {
        dispatch({
            type: 'error',
            message: 'Failed to migrate collection',
            title: JSON.stringify(error),
            position: 'topR'
        });
        setIsCommitting(false);
    } else if (isSuccess) {
        dispatch({
            type: 'success',
            message: 'Collection migrated',
            title: `You have migrated your collection to ${targetChain.name}`,
            position: 'topR'
        });
        setIsOpen(false);
    }*/

    const setTargetChainInfo = name => {
        const targetChain = supportedChains.find(chain => chain.name === name);
        targetChain.address = targetChain.address || networkMapping[targetChain.chainId].loveToken.at(-1);
        setTargetChain(targetChain);
    };

    const [isCommitting, setIsCommitting] = useState(false);

    const validate = () => {
        if (targetChain === null) {
            return dispatch({ type: 'error', message: 'Please select a target chain', title: 'Missing required info', position: 'topR' });
        }
        if (targetChain.chainId === chain.id) {
            return dispatch({ type: 'error', message: `Collection is already on ${targetChain.name} - Please select a different chain`, title: 'Invalid action', position: 'topR' });
        }
        return true;
    };

    const commit = async () => {
        setIsCommitting(true);
        const tx = await loveToken.transferCollection(targetChain.domain, targetChain.address, collectionId);
        await tx.wait();
        dispatch({
            type: 'success',
            message: 'Collection migrated',
            title: `You have migrated your collection to ${targetChain.name}`,
            position: 'topR'
        });
    };

    const queryClient = useQueryClient();
    const mutation = useMutation(commit, {
        onError: error => {
            dispatch({ type: 'error', message: error.message, title: 'Failed to migrate collection', position: 'topR' });
        },
        onSettled: () => setIsCommitting(false),
        onSuccess: () => {
            queryClient.setQueryData(['collections', { chainId: chain.id, address: lowerCaseAddress }], oldData => {
                const newData = JSON.parse(JSON.stringify(oldData));
                console.log('newData before splice ', newData)
                console.log('index ', oldData.findIndex(({ objectid }) => objectid === collectionId));
                newData.splice(oldData.findIndex(({ objectid }) => objectid === collectionId), 1);
                console.log('new data after splice ')
                return newData;
            });
            setIsOpen(false);
        }
    });

    return (
        <div className='relative z-10' aria-labelledby='modal-title' role='dialog' aria-modal='true'>
            <div className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity'></div>

            <div className='fixed inset-0 z-10 overflow-y-auto'>
                <div className='flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0'>
                    <div className='relative transform overflow-hidden rounded-lg bg-lighterPink shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg'>
                        {isCommitting && <div className='w-full absolute h-full bg-white/70 z-50 flex items-center justify-center'>
                            <div className='loader'></div>
                        </div>}
                        <h2 className='font-bold text-xl text-gray-700 p-4 tracking-wider'>Select Target Chain</h2>
                        <div className='p-4 mb-1'>
                            <div className='grid grid-cols-3 gap-x-4 gap-y-10 tracking-wide text-gray-700'>
                                {
                                    supportedChains.map(({ icon, name }) => {
                                        return (
                                            <div key={name} className='flex gap-2'>
                                                <input type='radio' name='chain' className='accent-crimsonRed cursor-pointer' checked={name === targetChain?.name} onChange={() => setTargetChainInfo(name)} />
                                                <div className='flex items-center gap-1'><Image src={icon} height={30} width={30} />{name}</div>
                                            </div>
                                        );
                                    })
                                }
                            </div>
                        </div>
                        <div className='px-4 py-3 flex flex-col md:flex-row-reverse items-stretch justify-center sm:px-6 gap-2 mb-2'>
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