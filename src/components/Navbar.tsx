"use client";
import { useState } from 'react';
import Link from 'next/link';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid';

export default function Navbar() {

    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="fixed w-full h-20 p-5 z-50 bg-white-secondary flex justify-center items-center border-b border-black-300 shadow-md text-black-primary">
            <div className="w-[90%] h-full flex justify-between items-center">
                <div className="w-fit flex h-full gap-8 items-center font-semibold text-[15px] leading-[100%] tracking-[0]">
                    <div className="md:hidden text-black-primary">
                        <button className='cursor-pointer' onClick={() => setIsOpen(!isOpen)}>
                            {isOpen ? (
                            <XMarkIcon className="h-6 w-6" />
                            ) : (
                            <Bars3Icon className="h-6 w-6" />
                            )}
                        </button>
                    </div>
                    <img className="w-[100px]" src="/snap.svg" alt="snap logo" />
                    <div className="w-fit hidden md:flex h-full gap-8 items-center font-semibold text-[15px] leading-[100%] tracking-[0]">  
                        <a className="hover:scale-110 transition-transform duration-300" href="">About</a>
                        <a className="hover:scale-110 transition-transform duration-300" href="">Museum</a>
                        <a className="hover:scale-110 transition-transform duration-300" href="">Collection</a>
                        <a className="hover:scale-110 transition-transform duration-300" href="">Get Verify</a>
                    </div>
                </div>
                <a className="bg-blue-secondary p-2 rounded-3xl text-white-primary font-semibold border-1 border-solid border-black" href="">Create a Snap</a>
            </div>

            {/* --- Menu Mobile Sidebar --- */}
            {/* Background Overlay */}
            <div
                className={`fixed inset-0 transition-opacity duration-300 ease-in-out z-30 ${
                isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
                onClick={() => setIsOpen(false)}
            ></div>

            {/* Konten Menu */}
            <div
                className={`fixed md:hidden top-0 left-0 h-screen w-3/4 max-w-sm shadow-2xl transform transition-transform duration-300 ease-in-out z-40 bg-white-secondary p-6 ${
                isOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                {/* Ganti 'bg-white-secondary' dengan warna Anda. Contoh: 'bg-gray-900 text-white' */}
                <div className='flex py-4 gap-3 items-center'>
                <div className="text-black-primary">
                    <button className='cursor-pointer' onClick={() => setIsOpen(!isOpen)}>
                        {isOpen ? (
                        <XMarkIcon className="h-7 w-7" />
                        ) : (
                        <Bars3Icon className="h-6 w-6" />
                        )}
                    </button>
                </div>
                <img className="w-[100px]" src="/snap.svg" alt="snap logo" />
                </div>
                <Link href="/about" className="w-fit block py-3 font-semibold text-2xl leading-[100%] hover:scale-110 transition-transform duration-300">About</Link>
                <Link href="/services" className="w-fit block py-3 font-semibold text-2xl leading-[100%] hover:scale-110 transition-transform duration-300">Services</Link>
                <Link href="/contact" className="w-fit block py-3 font-semibold text-2xl leading-[100%] hover:scale-110 transition-transform duration-300">Contact</Link>
            </div>
        </div>
    )
}

