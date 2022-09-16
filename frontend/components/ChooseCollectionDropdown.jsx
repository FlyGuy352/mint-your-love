import { AiOutlineDown, AiOutlinePlus } from 'react-icons/ai';
import { BiPhotoAlbum } from 'react-icons/bi';

export default function ChooseCollectionDropdown({ collections, collectionName, divRef, isChoosingCollection, setIsChoosingCollection, handleCollectionClick }) {
    return (
        <div ref={divRef} className='flex flex-col gap-1 text-gray-700'>
            <div className='relative'>
                <button className='w-full flex items-center justify-between bg-white border border-blue-200 rounded-md text-sm py-1 cursor-pointer focus:outline-none focus:ring-4 focus:ring-lightSkyBlue transition ease-in-out duration-300' onClick={() => setIsChoosingCollection(!isChoosingCollection)}>
                    <div className='flex items-center'>
                        <div className='px-1'><BiPhotoAlbum /></div><div>{collectionName}</div>
                    </div>
                    <div className='px-2'><AiOutlineDown /></div>
                </button>
                {isChoosingCollection &&
                    <div className='text-sm bg-white absolute opacity:100 mt-1 w-full'>
                        {collections?.map(({ objectid, name }) => {
                            return (
                                <div key={objectid} className='flex items-center py-1 cursor-pointer hover:bg-lightPink' onClick={() => handleCollectionClick(objectid, name)}>
                                    <div className='px-1'><BiPhotoAlbum /></div><div>{name}</div>
                                </div>
                            );
                        })}
                        <div className='flex items-center py-1 cursor-pointer hover:bg-lightPink' onClick={() => handleCollectionClick()}>
                            <div className='px-1'><AiOutlinePlus /></div><div className='font-medium'>Add New Collection</div>
                        </div>
                    </div>
                }
            </div>
        </div>
    );
};