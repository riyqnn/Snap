"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid';
import { useAccount } from 'wagmi';
import ConnectWallet from './atom/ConnectWallet';

interface NavbarProps {
  className?: string;
}

export default function Navbar({ className = "" }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { address, isConnected } = useAccount();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={
        `fixed w-full h-20 p-5 z-50 flex justify-center items-center text-black-primary transition-all duration-300 ` +
        (scrolled ? "bg-white-secondary shadow-md " : "") +
        className // 👉 ini custom class dari luar
      }
    >
      <div className="w-[90%] h-full flex justify-between items-center">
        <div className="w-fit flex h-full gap-8 items-center font-semibold text-[15px] leading-[100%] tracking-[0]">
          {/* Mobile Menu Button */}
          <div className="xl:hidden text-black-primary">
            <button className='cursor-pointer' onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
            </button>
          </div>

          {/* Logo */}
          <Link href="/"><img className="flex-shrink-0 min-w-[100px] w-[100px] xl:w-[120px]" src="/snap.svg" alt="snap logo" /></Link>

          {/* Desktop Menu */}
          <div className="w-fit hidden xl:flex h-full gap-8 items-center font-semibold text-[15px] leading-[100%] tracking-[0]">  
            <Link className="hover:scale-110 transition-transform duration-300" href="/about">About</Link>
            <Link className="hover:scale-110 transition-transform duration-300" href="/museum">Museum</Link>
            <Link className="hover:scale-110 transition-transform duration-300" href="/collection">Collection</Link>
            <Link className="hover:scale-110 transition-transform duration-300" href="/brand/create">Get Verify</Link>
          </div>
        </div>

        {/* Right Section */}
        <div className='flex gap-10 justify-center items-center'>
          <Link 
            href="/series/create"
            className={`bg-blue-secondary hidden ${isConnected ? "xl:block" : "hidden"} p-2 rounded-3xl text-white-primary font-semibold border-1 border-solid border-black`}
          >
            Create a Snap
          </Link>
          <ConnectWallet />
        </div>
      </div>

      {/* --- Overlay for mobile --- */}
      <div
        className={`fixed inset-0 transition-opacity duration-300 ease-in-out z-30 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsOpen(false)}
      ></div>

      {/* --- Mobile Sidebar --- */}
      <div
        className={`fixed xl:hidden top-0 left-0 h-screen w-3/4 max-w-sm shadow-2xl transform transition-transform duration-300 ease-in-out z-40 bg-white-secondary p-6 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className='flex py-4 gap-3 items-center'>
          <div className="text-black-primary">
            <button className='cursor-pointer' onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <XMarkIcon className="h-7 w-7" /> : <Bars3Icon className="h-6 w-6" />}
            </button>
          </div>
          <img className="w-[100px]" src="/snap.svg" alt="snap logo" />
        </div>

        <Link href="/about" className="w-fit block py-3 font-semibold text-2xl leading-[100%] hover:scale-110 transition-transform duration-300">About</Link>
        <Link href="/museum" className="w-fit block py-3 font-semibold text-2xl leading-[100%] hover:scale-110 transition-transform duration-300">Museum</Link>
        <Link href="/collection" className="w-fit block py-3 font-semibold text-2xl leading-[100%] hover:scale-110 transition-transform duration-300">Collection</Link>
        <Link href="/get-verify" className="w-fit block py-3 font-semibold text-2xl leading-[100%] hover:scale-110 transition-transform duration-300">Get Verify</Link>
        <Link 
          href="/brand/create"
          className={`bg-blue-secondary max-w-fit ${isConnected ? "block" : "hidden"} p-2 rounded-3xl text-white-primary font-semibold border-1 border-solid border-black`}
        >
          Create a Snap
        </Link>
      </div>
    </div>
  );
}
