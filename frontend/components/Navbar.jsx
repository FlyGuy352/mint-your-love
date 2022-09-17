import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AiFillHome, AiOutlineClose, AiOutlineMenu } from 'react-icons/ai';
import { GiCupidonArrow } from 'react-icons/gi';
import { MdFindInPage } from 'react-icons/md';
import logoImg from '../public/assets/images/logo.svg';
import logoWhiteBackgroundImg from '../public/assets/images/logo_white.svg';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';

export default function Navbar() {
    const [nav, setNav] = useState(false);

    return (
        <nav className='w-full py-3 px-4 bg-white'>
            <div className='flex items-center justify-between gap-2'>
                <div onClick={() => setNav(true)} className='md:hidden cursor-pointer'>
                    <AiOutlineMenu size={25} />
                </div>
                <div className='hidden md:flex basis-full'>
                    <Link href='/'>
                        <Image src={logoImg} alt='Logo' width='100' height='40' className='cursor-pointer' />
                    </Link>
                </div>
                <div className='hidden md:flex items-center justify-between basis-full'>
                    <Link href='/'><div className='flex items-center cursor-pointer text-crimsonRed font-Kodchasan text-sm hover:font-bold'><AiFillHome color='#DC143C' /> Home</div></Link>
                    <Link href='/myCollection'><div className='flex items-center cursor-pointer text-crimsonRed font-Kodchasan text-sm hover:font-bold'><GiCupidonArrow color='#DC143C' /> My Collection</div></Link>
                    <Link href='/browse'><div className='flex items-center cursor-pointer text-crimsonRed font-Kodchasan text-sm hover:font-bold'><MdFindInPage color='#DC143C' /> Browse</div></Link>
                </div>
                <div className='basis-full flex items-center justify-end'>
                    <div className='font-xs text-xs'><ConnectButton showBalance={false} /></div>
                </div>
            </div>

            {<div className={nav ? 'md:hidden fixed left-0 top-0 w-full h-screen bg-black/70 z-50' : ''}>
                <div className={
                    nav ?
                        'fixed left-0 top-0 w-[75%] sm:w-[60%] h-screen bg-lighterPink p-10 ease-in duration-500' :
                        'fixed left-[-100%] top-0 p-10 ease-in duration-500'
                }>
                    <div className={nav ? 'block' : 'hidden'}>
                        <div>
                            <div className='flex w-full items-center justify-between'>
                                <Image src={logoWhiteBackgroundImg} alt='Logo' width='110' height='110' />
                                <div onClick={() => setNav(false)} className='rounded-full shadow-lg shadow-gray-400 bg-white p-3 cursor-pointer'>
                                    <AiOutlineClose />
                                </div>
                            </div>
                            <div className='border-b border-gray-300 my-4'>
                                <p className='w-[85%] py-4 text-crimsonRed uppercase tracking-wider'>Immortalize Your Love on the Blockchain</p>
                            </div>
                        </div>
                        <div className='py-4'>
                            <ul>
                                <Link href='/'>
                                    <li onClick={() => setNav(false)} className='py-5 text-crimsonRed'>
                                        <div className='flex items-center cursor-pointer font-Kodchasan text-sm hover:font-bold'><AiFillHome color='#DC143C' /> Home</div>
                                    </li>
                                </Link>
                                <Link href='/myCollection'>
                                    <li onClick={() => setNav(false)} className='py-5 text-crimsonRed'>
                                        <div className='flex items-center cursor-pointer font-Kodchasan text-sm hover:font-bold'><GiCupidonArrow color='#DC143C' /> My Collection</div>
                                    </li>
                                </Link>
                                <Link href='/browse'>
                                    <li onClick={() => setNav(false)} className='py-5 text-crimsonRed'>
                                        <div className='flex items-center cursor-pointer font-Kodchasan text-sm hover:font-bold'><MdFindInPage color='#DC143C' /> Browse</div>
                                    </li>
                                </Link>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>}
        </nav>
    );
};
