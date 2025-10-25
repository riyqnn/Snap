"use client";
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Bars3Icon, XMarkIcon, ChevronDownIcon } from '@heroicons/react/24/solid';
import { useAccount } from 'wagmi';
import ConnectWallet from './atom/ConnectWallet';

interface NavbarProps {
  className?: string;
}

export default function Navbar({ className = "" }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [brandDropdown, setBrandDropdown] = useState(false);
  const [collectionDropdown, setCollectionDropdown] = useState(false);
  const [mobileBrandOpen, setMobileBrandOpen] = useState(false);
  const [mobileCollectionOpen, setMobileCollectionOpen] = useState(false);

  const { address, isConnected } = useAccount();
  const brandRef = useRef<HTMLDivElement>(null);
  const collectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (brandRef.current && !brandRef.current.contains(event.target as Node)) {
        setBrandDropdown(false);
      }
      if (collectionRef.current && !collectionRef.current.contains(event.target as Node)) {
        setCollectionDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu when clicking a link
  const handleMobileClick = () => {
    setIsOpen(false);
    setMobileBrandOpen(false);
    setMobileCollectionOpen(false);
  };

  return (
    <>
      {/* Navbar utama (auto hide pas hamburger aktif) */}
      <div
        className={
          `fixed w-full h-20 p-5 z-50 flex justify-center items-center text-black-primary transition-all duration-300
          ${scrolled ? "bg-white-secondary shadow-md " : ""}
          ${isOpen ? "opacity-0 pointer-events-none" : "opacity-100"} 
          ` + className
        }
      >
        <div className="w-[90%] h-full flex justify-between items-center">
          <div className="w-fit flex h-full gap-8 items-center font-semibold text-[15px] leading-[100%] tracking-[0]">
            {/* Mobile Menu Button */}
            <div className="xl:hidden text-black-primary">
              <button
                className='cursor-pointer hover:scale-110 transition-transform duration-200'
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle menu"
              >
                {isOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
              </button>
            </div>

            {/* Logo */}
            <Link href="/" className="hover:opacity-80 transition-opacity duration-200">
              <img className="flex-shrink-0 min-w-[100px] w-[100px] xl:w-[120px]" src="/snap.svg" alt="snap logo" />
            </Link>

            {/* Desktop Menu */}
            <div className="w-fit hidden xl:flex h-full gap-8 items-center font-semibold text-[15px] leading-[100%] tracking-[0]">
              <Link className="hover:scale-110 hover:text-blue-secondary transition-all duration-300" href="/about">
                About
              </Link>
              <Link className="hover:scale-110 hover:text-blue-secondary transition-all duration-300" href="/museum">
                Museum
              </Link>

              {/* Brand Dropdown */}
              <div className="relative" ref={brandRef}>
                <button
                  onClick={() => {
                    setBrandDropdown(!brandDropdown);
                    setCollectionDropdown(false);
                  }}
                  className="flex items-center gap-1 hover:scale-110 hover:text-blue-secondary transition-all duration-300"
                >
                  Brand
                  <ChevronDownIcon className={`h-4 w-4 transition-transform duration-300 ${brandDropdown ? 'rotate-180' : ''}`} />
                </button>

                {brandDropdown && (
                  <div className="absolute top-full mt-2 w-48 bg-white-secondary rounded-xl shadow-lg border border-gray-200 overflow-hidden animate-fadeIn">
                    <Link
                      href={`/brand/${address}`}
                      onClick={() => setBrandDropdown(false)}
                      className="block px-6 py-3 hover:bg-blue-secondary hover:text-white-primary transition-colors duration-200"
                    >
                      My Brand
                    </Link>
                    <Link
                      href="/brand/create"
                      onClick={() => setBrandDropdown(false)}
                      className="block px-6 py-3 hover:bg-blue-secondary hover:text-white-primary transition-colors duration-200"
                    >
                      Create Brand
                    </Link>
                  </div>
                )}
              </div>

              {/* Collection Dropdown */}
              <div className="relative" ref={collectionRef}>
                <button
                  onClick={() => {
                    setCollectionDropdown(!collectionDropdown);
                    setBrandDropdown(false);
                  }}
                  className="flex items-center gap-1 hover:scale-110 hover:text-blue-secondary transition-all duration-300"
                >
                  Collection
                  <ChevronDownIcon className={`h-4 w-4 transition-transform duration-300 ${collectionDropdown ? 'rotate-180' : ''}`} />
                </button>

                {collectionDropdown && (
                  <div className="absolute top-full mt-2 w-48 bg-white-secondary rounded-xl shadow-lg border border-gray-200 overflow-hidden animate-fadeIn">
                    <Link
                      href="/collection"
                      onClick={() => setCollectionDropdown(false)}
                      className="block px-6 py-3 hover:bg-blue-secondary hover:text-white-primary transition-colors duration-200"
                    >
                      Collection
                    </Link>
                    <Link
                      href="/mint"
                      onClick={() => setCollectionDropdown(false)}
                      className="block px-6 py-3 hover:bg-blue-secondary hover:text-white-primary transition-colors duration-200"
                    >
                      Mint
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className='flex gap-4 justify-center items-center'>
            {isConnected && (
              <Link
                href="/series/create"
                className="bg-blue-secondary hidden xl:block px-5 py-2.5 rounded-full text-white-primary font-semibold border border-black hover:bg-blue-600 hover:scale-105 transition-all duration-300 shadow-sm"
              >
                Create a Snap
              </Link>
            )}
            <ConnectWallet />
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ease-in-out z-30 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsOpen(false)}
      ></div>

      {/* Mobile Sidebar */}
      <div
        className={`fixed xl:hidden top-0 left-0 h-screen w-[85%] max-w-sm shadow-2xl transform transition-transform duration-300 ease-in-out z-40 bg-white-secondary ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className='flex flex-col h-full'>
          {/* Header */}
          <div className='flex py-5 px-6 gap-3 items-center border-b border-gray-200'>
            <button
              className='cursor-pointer hover:scale-110 transition-transform duration-200'
              onClick={() => setIsOpen(false)}
              aria-label="Close menu"
            >
              <XMarkIcon className="h-7 w-7 text-black-primary" />
            </button>
            <img className="w-[100px]" src="/snap.svg" alt="snap logo" />
          </div>

          {/* Menu Items */}
          <div className='flex-1 overflow-y-auto py-6 px-6'>
            <nav className='flex flex-col gap-2'>
              <Link
                href="/about"
                onClick={handleMobileClick}
                className="w-full py-3 px-4 font-semibold text-lg rounded-lg hover:bg-blue-secondary/10 hover:text-blue-secondary transition-all duration-200"
              >
                About
              </Link>

              <Link
                href="/museum"
                onClick={handleMobileClick}
                className="w-full py-3 px-4 font-semibold text-lg rounded-lg hover:bg-blue-secondary/10 hover:text-blue-secondary transition-all duration-200"
              >
                Museum
              </Link>

              {/* Brand Dropdown Mobile */}
              <div className="w-full">
                <button
                  onClick={() => setMobileBrandOpen(!mobileBrandOpen)}
                  className="w-full py-3 px-4 font-semibold text-lg rounded-lg hover:bg-blue-secondary/10 hover:text-blue-secondary transition-all duration-200 flex items-center justify-between"
                >
                  Brand
                  <ChevronDownIcon className={`h-5 w-5 transition-transform duration-300 ${mobileBrandOpen ? 'rotate-180' : ''}`} />
                </button>

                <div className={`overflow-hidden transition-all duration-300 ${mobileBrandOpen ? 'max-h-40' : 'max-h-0'}`}>
                  <div className="pl-4 pt-1 flex flex-col gap-1">
                    <Link
                      href={`/brand/${address}`}
                      onClick={handleMobileClick}
                      className="py-2 px-4 text-base rounded-lg hover:bg-blue-secondary/10 hover:text-blue-secondary transition-all duration-200"
                    >
                      My Brand
                    </Link>
                    <Link
                      href="/brand/create"
                      onClick={handleMobileClick}
                      className="py-2 px-4 text-base rounded-lg hover:bg-blue-secondary/10 hover:text-blue-secondary transition-all duration-200"
                    >
                      Create Brand
                    </Link>
                  </div>
                </div>
              </div>

              {/* Collection Dropdown Mobile */}
              <div className="w-full">
                <button
                  onClick={() => setMobileCollectionOpen(!mobileCollectionOpen)}
                  className="w-full py-3 px-4 font-semibold text-lg rounded-lg hover:bg-blue-secondary/10 hover:text-blue-secondary transition-all duration-200 flex items-center justify-between"
                >
                  Collection
                  <ChevronDownIcon className={`h-5 w-5 transition-transform duration-300 ${mobileCollectionOpen ? 'rotate-180' : ''}`} />
                </button>

                <div className={`overflow-hidden transition-all duration-300 ${mobileCollectionOpen ? 'max-h-40' : 'max-h-0'}`}>
                  <div className="pl-4 pt-1 flex flex-col gap-1">
                    <Link
                      href="/collection"
                      onClick={handleMobileClick}
                      className="py-2 px-4 text-base rounded-lg hover:bg-blue-secondary/10 hover:text-blue-secondary transition-all duration-200"
                    >
                      Collection
                    </Link>
                    <Link
                      href="/mint"
                      onClick={handleMobileClick}
                      className="py-2 px-4 text-base rounded-lg hover:bg-blue-secondary/10 hover:text-blue-secondary transition-all duration-200"
                    >
                      Mint
                    </Link>
                  </div>
                </div>
              </div>
            </nav>

            {/* Create Snap Button for Mobile */}
            {isConnected && (
              <Link
                href="/series/create"
                onClick={handleMobileClick}
                className="mt-6 w-full block text-center bg-blue-secondary px-5 py-3 rounded-full text-white-primary font-semibold border border-black hover:bg-blue-600 transition-all duration-300 shadow-sm"
              >
                Create a Snap
              </Link>
            )}
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </>
  );
}
