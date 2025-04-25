'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, usePathname } from 'next/navigation';

export default function PageLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [showMenu, setShowMenu] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  
  // Close mobile menu when page changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [children]);
  
  // Handle session timeout and protected routes
  useEffect(() => {
    // Check if we're on a protected route and user is not authenticated
    const isProtectedRoute = ['/dashboard', '/profile', '/submit-wordle'].includes(pathname);
    if (isProtectedRoute && status === 'unauthenticated') {
      router.push(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
    }
  }, [status, pathname, router]);
  
  // Log session info in development only
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log("Session status:", status);
      console.log("Session data:", session);
    }
  }, [session, status]);
  
  const handleSignOut = async () => {
    // Clear any local storage or other state if needed
    localStorage.removeItem('userPreferences');
    sessionStorage.clear();
    
    // Sign out and redirect to home
    await signOut({ callbackUrl: '/' });
  };
  
  // Force explicit check on authentication status
  const userLoggedIn = status === 'authenticated' && session !== null;
  
  // Check if on auth pages (login/signup)
  const isAuthPage = ['/login', '/signup'].includes(pathname);
  
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation bar */}
      <nav className="fixed top-0 left-0 right-0 bg-black/70 backdrop-blur-md z-20 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-semibold text-white hover:text-gray-300 transition-colors">
                Wordle Circles
              </span>
            </Link>
            
            {/* Desktop navigation */}
            <div className="hidden md:flex space-x-4 items-center">
              {status === 'loading' ? (
                // Show loading skeleton while checking auth status
                <div className="h-9 w-24 bg-gray-800/50 animate-pulse rounded-full"></div>
              ) : userLoggedIn ? (
                // USER IS LOGGED IN - Show user menu AND login/signup links
                <>
                  <div className="relative">
                    <button
                      onClick={() => setShowMenu(!showMenu)}
                      className="flex items-center space-x-2 text-gray-300 hover:text-white px-3 py-2 rounded-full hover:bg-white/5 transition-colors"
                    >
                      <span className="text-green-400">
                        {session?.user?.name || session?.user?.email?.split('@')[0] || 'User'}
                      </span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                    
                    <AnimatePresence>
                      {showMenu && (
                        <motion.div 
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute right-0 mt-2 w-48 bg-gray-900 rounded-md shadow-lg border border-gray-800 overflow-hidden z-50"
                        >
                          <Link href="/dashboard" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 transition-colors">
                            Dashboard
                          </Link>
                          <Link href="/profile" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 transition-colors">
                            Profile
                          </Link>
                          <Link href="/submit-wordle" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 transition-colors">
                            Submit Wordle
                          </Link>
                          <button
                            onClick={handleSignOut}
                            className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 transition-colors"
                          >
                            Sign Out
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  
                  {/* Always show login/signup links */}
                  <div className="ml-4 flex space-x-2">
                    <Link href="/signup" className="nav-btn text-sm py-1.5">
                      Sign Up
                    </Link>
                    <Link href="/login" className="nav-btn bg-white/10 hover:bg-white/15 text-sm py-1.5">
                      Log In
                    </Link>
                  </div>
                </>
              ) : (
                // USER IS NOT LOGGED IN - Show login/signup buttons
                <>
                  <Link href="/signup" className="nav-btn">
                    Sign Up
                  </Link>
                  <Link href="/login" className="nav-btn bg-white/10 hover:bg-white/15">
                    Log In
                  </Link>
                </>
              )}
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-400 hover:text-white focus:outline-none"
                aria-label="Toggle menu"
              >
                <svg 
                  className="h-6 w-6" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  {isMobileMenuOpen ? (
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
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden bg-gray-900/90 backdrop-blur-md"
            >
              <div className="px-2 pt-2 pb-3 space-y-1 border-t border-gray-800">
                {status === 'loading' ? (
                  <div className="h-10 mx-3 bg-gray-800/50 animate-pulse rounded"></div>
                ) : (
                  <>
                    {/* Always show login/signup links, regardless of auth status */}
                    <Link href="/login" className="block px-3 py-2 rounded text-gray-300 hover:bg-gray-800 hover:text-white">
                      Log In
                    </Link>
                    <Link href="/signup" className="block px-3 py-2 rounded text-green-400 hover:bg-gray-800 hover:text-green-300">
                      Sign Up
                    </Link>
                    
                    {/* Show user-specific links when logged in */}
                    {userLoggedIn && (
                      <>
                        <div className="my-2 border-t border-gray-800 pt-2"></div>
                        <div className="px-3 py-1 text-xs text-gray-500">ACCOUNT</div>
                        <Link href="/dashboard" className="block px-3 py-2 rounded text-gray-300 hover:bg-gray-800 hover:text-white">
                          Dashboard
                        </Link>
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
        </AnimatePresence>
      </nav>
      
      {/* Click outside to close desktop menu */}
      {showMenu && (
        <div 
          className="fixed inset-0 z-10"
          onClick={() => setShowMenu(false)}
        />
      )}
      
      {/* Main content with padding for fixed nav */}
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </div>
      </main>
    </div>
  );
} 