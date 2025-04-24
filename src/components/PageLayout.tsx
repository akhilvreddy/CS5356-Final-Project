'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-black">
      {/* Navigation bar */}
      <nav className="fixed top-0 left-0 right-0 bg-black/70 backdrop-blur-md z-20 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300">
                Wordle Circles
              </span>
            </Link>
            
            <div className="flex space-x-4">
              <span className="nav-btn">
                Sign Up
              </span>
              <span className="nav-btn bg-white/10 hover:bg-white/15">
                Log In
              </span>
            </div>
          </div>
        </div>
      </nav>
      
      {/* Main content */}
      <main>
        {children}
      </main>
    </div>
  );
} 