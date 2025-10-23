'use client';

import React from 'react';
import Image from 'next/image';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white-secondary border-t border-gray-200">
      <div className="container mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Logo + Nama */}
        <div className="flex items-center gap-3">
          <Image
            src="/snap.svg"
            alt="SNAP Logo"
            width={36}
            height={36}
            className="w-[80px]"
          />
          <span className="text-[#0052FF] text-lg font-semibold">
            &copy; 2025 SNAP Inc.
          </span>
        </div>

        {/* Links */}
        <nav className="flex flex-wrap justify-center md:justify-end items-center text-[#0052FF] text-sm gap-4">
          <a href="#" className="hover:underline">
            Terms of Service
          </a>
          <span className="hidden md:block border-l border-gray-300 h-4" />
          <a href="#" className="hover:underline">
            Privacy Policy
          </a>
          <span className="hidden md:block border-l border-gray-300 h-4" />
          <a href="#" className="hover:underline">
            Data Policy
          </a>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
