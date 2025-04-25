'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';

export default function SimplePageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile menu when switching pages
  useEffect(() => {
    setIsMenuOpen(false);
  }, [children]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
  const handleSignOut = () => {
    // Clear any local storage or other state if needed
    localStorage.removeItem('userPreferences');
    sessionStorage.clear();
    
    signOut({ callbackUrl: '/' });
  };
  
  // Check if on auth pages (login/signup)
  const isAuthPage = ['/login', '/signup'].includes(pathname);
  const userLoggedIn = status === 'authenticated' && session !== null;
  
  // On auth pages when already logged in, render minimal layout
  if (isAuthPage && userLoggedIn) {
    return (
      <div className="flex flex-col min-h-screen bg-black text-white">
        <main className="flex-grow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {children}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-10 bg-black/80 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-xl font-bold text-white hover:text-gray-300 transition">
                Wordle Circles
              </Link>
            </div>

            {/* Desktop menu */}
            <div className="hidden md:flex items-center space-x-6">
              {status === 'loading' ? (
                <div className="h-4 w-24 bg-gray-800 animate-pulse rounded"></div>
              ) : (
                <>
                  {/* Always show login/signup links regardless of auth status */}
                  <Link 
                    href="/login" 
                    className="px-4 py-2 rounded bg-gray-800 hover:bg-gray-700 transition"
                  >
                    Login
                  </Link>
                  <Link 
                    href="/signup"
                    className="px-4 py-2 rounded bg-green-700 hover:bg-green-600 transition"
                  >
                    Sign Up
                  </Link>
                  
                  {/* Show additional links when logged in */}
                  {session && (
                    <>
                      <div className="h-6 border-l border-gray-700 mx-2"></div>
                      <Link href="/profile" className="text-gray-300 hover:text-green-400 transition">
                        Profile
                      </Link>
                      <Link href="/submit-wordle" className="text-gray-300 hover:text-green-400 transition">
                        Submit Wordle
                      </Link>
                      <button 
                        onClick={handleSignOut}
                        className="px-4 py-2 rounded bg-red-800 hover:bg-red-700 transition text-white"
                      >
                        Sign Out
                      </button>
                    </>
                  )}
                </>
              )}
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={toggleMenu}
                className="text-gray-400 hover:text-white focus:outline-none"
                aria-label="Toggle menu"
              >
                <svg 
                  className="h-6 w-6" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  {isMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <motion.div 
            className="md:hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-800">
              {status === 'loading' ? (
                <div className="h-10 bg-gray-800 animate-pulse rounded mx-3"></div>
              ) : (
                <>
                  {/* Always show login/signup links */}
                  <Link href="/login" className="block px-3 py-2 rounded text-gray-300 hover:bg-gray-800 hover:text-white">
                    Login
                  </Link>
                  <Link href="/signup" className="block px-3 py-2 rounded text-green-400 hover:bg-gray-800 hover:text-green-300">
                    Sign Up
                  </Link>
                  
                  {/* Show additional options when logged in */}
                  {session && (
                    <>
                      <div className="my-2 border-t border-gray-800 pt-2"></div>
                      <div className="px-3 py-1 text-xs text-gray-500">ACCOUNT</div>
                      <Link href="/profile" className="block px-3 py-2 rounded text-gray-300 hover:bg-gray-800 hover:text-white">
                        Profile
                      </Link>
                      <Link href="/submit-wordle" className="block px-3 py-2 rounded text-gray-300 hover:bg-gray-800 hover:text-white">
                        Submit Wordle
                      </Link>
                      <button 
                        onClick={handleSignOut}
                        className="w-full text-left px-3 py-2 rounded text-red-400 hover:bg-gray-800 hover:text-red-300"
                      >
                        Sign Out
                      </button>
                    </>
                  )}
                </>
              )}
            </div>
          </motion.div>
        )}
      </nav>

      {/* Main content */}
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </div>
      </main>

      {/* Footer with auth debug info - only in development */}
      {process.env.NODE_ENV === 'development' && (
        <footer className="bg-gray-900 text-gray-400 text-xs p-2">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p>Auth Status: {status}</p>
            {session && (
              <p>User ID: {session.user?.email || 'unknown'}</p>
            )}
          </div>
        </footer>
      )}
    </div>
  );
} 