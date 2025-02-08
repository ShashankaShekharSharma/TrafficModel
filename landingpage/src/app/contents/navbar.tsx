'use client'

import Link from "next/link";
import { useState } from "react";
import '@/app/globals.css';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-8 left-12 right-12 z-50 bg-black shadow-md rounded-xl bg-opacity-75 backdrop-blur-sm">
      <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center text-xl font-bold text-orange-500">
            <img src="/logo.jpeg" alt="a" className="h-8 w-8 rounded-3xl m-3" />
            <Link href="#home">DigiRaksha</Link>
          </div>
          <div className="hidden md:flex space-x-8">
            <Link href="#home" className="text-white hover:text-black hover:bg-orange-500 p-2 transition-colors rounded-lg">Home</Link>
            <Link href="#models" className="text-white  hover:text-black hover:bg-orange-500 p-2 transition-colors rounded-lg">Models</Link>
            <Link href="#devs" className="text-white  hover:text-black hover:bg-orange-500 p-2 transition-colors rounded-lg">Devs</Link>
          </div>
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-orange-500 focus:outline-none"
            >
              {isOpen ? (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white shadow-lg rounded-lg mt-2 bg-opacity-15 backdrop-blur-sm">
          <div className="space-y-2 px-4 pt-2 pb-4 text-left">
            <Link href="#home" className="block text-white  hover:text-orange-500">Home</Link>
            <Link href="#models" className="block text-white  hover:text-orange-500">Models</Link>
            <Link href="#devs" className="block text-white  hover:text-orange-500">Devs</Link>
          </div>
        </div>
      )}
    </nav>
  );
}