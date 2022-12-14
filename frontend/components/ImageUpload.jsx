import { useState } from 'react';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import { useNotification } from '@web3uikit/core';

export default function ImageUpload({ file, setFile }) {

    const [isUploaded, setIsUploaded] = useState(false);

    const handleDragEnter = e => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDragLeave = e => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDragOver = e => {
        e.preventDefault();
        e.stopPropagation();
        e.dataTransfer.dropEffect = 'copy';
    };

    const dispatch = useNotification();
    const handleDrop = e => {
        if (isUploaded) {
            return;
        }
        e.preventDefault();
        e.stopPropagation();
        const uploadedFiles = [...e.dataTransfer.files];
        if (uploadedFiles?.length > 1) {
            dispatch({ type: 'error', message: 'Please upload just one file', title: 'Limit exceeded', position: 'topR' });
        } else if (uploadedFiles?.length == 1) {
            setFile(uploadedFiles[0]);
            setIsUploaded(true);
        }
    };

    const handleFileInputChange = e => {
        if (e.currentTarget.files.length === 1) {
            setFile(e.currentTarget.files[0]);
            setIsUploaded(true);
        }
    };

    return (
        <div onDragEnter={e => handleDragEnter(e)} onDragOver={e => handleDragOver(e)} onDragLeave={e => handleDragLeave(e)} onDrop={e => handleDrop(e)}>
            <label
                className={`flex justify-center w-full px-4 rounded-lg appearance-none focus:outline-none border ${isUploaded ? 'bg-success' : 'bg-white border-blue-200 border-dashed cursor-pointer'}`}>
                <span className='flex flex-col gap-3 p-4 items-center'>
                    <div className='cursor-pointer' title='Change selected image'><AiOutlineCloudUpload size={50} /></div>
                    {!isUploaded && <span className='text-gray-500 text-xs'>Drag and drop or browse to choose a file</span>}
                    {isUploaded && <span className='text-gray-700 text-xs'>{`Selected file: ${file.name}`}</span>}
                </span>
                <input type='file' className='hidden' accept='.png,.jpg' onChange={e => handleFileInputChange(e)} />
            </label>
        </div>
    );
};
