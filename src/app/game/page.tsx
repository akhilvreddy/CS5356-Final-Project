'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import PageLayout from '@/components/PageLayout';

export default function GamePage() {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto pt-8">
        <h1 className="text-4xl font-bold text-center mb-3 bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-emerald-300 to-teal-400">
          Wordle Circles
        </h1>
        <p className="text-gray-400 text-center mb-8">
          Submit and track your own custom 5-letter words
        </p>
        
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <svg className="animate-spin h-12 w-12 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="mt-4 text-gray-400">Loading content...</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Auth status banner */}
            {status !== 'loading' && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className={`mb-6 p-4 rounded-lg border text-center ${
                  status === 'authenticated' 
                    ? 'bg-green-900/20 border-green-800' 
                    : 'bg-gray-800/40 border-gray-700'
                }`}
              >
                {status === 'authenticated' ? (
                  <p className="text-green-300">
                    Welcome back, {session?.user?.name || session?.user?.email?.split('@')[0] || 'Player'}! 
                    Ready to submit a new Wordle word?
                  </p>
                ) : (
                  <div className="space-y-2">
                    <p className="text-gray-300">
                      Sign in to submit your own words and track your submissions
                    </p>
                    <div className="flex justify-center space-x-3 mt-2">
                      <Link 
                        href="/login" 
                        className="px-4 py-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors text-sm"
                      >
                        Log In
                      </Link>
                      <Link 
                        href="/signup" 
                        className="px-4 py-2 rounded-full nav-btn text-sm"
                      >
                        Sign Up
                      </Link>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
            
            <div className="bg-gray-900/60 border border-gray-800 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-semibold text-green-400 mb-4">Submit a Wordle</h2>
              
              <div className="bg-gray-800/80 p-5 rounded-md mb-6 text-center">
                <p className="text-gray-300 mb-5">Create your own 5-letter word for others to guess</p>
                
                <Link 
                  href="/submit-wordle" 
                  className={`nav-btn px-8 py-3 rounded-full font-medium text-center ${
                    status !== 'authenticated' ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
                  }`}
                  aria-disabled={status !== 'authenticated'}
                  onClick={(e) => {
                    if (status !== 'authenticated') {
                      e.preventDefault();
                      alert('Please log in to submit a word');
                    }
                  }}
                >
                  Submit New Word
                </Link>
              </div>
            </div>
            
            <motion.div 
              className="bg-gray-900/40 border border-gray-800 rounded-lg p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <h2 className="text-xl font-semibold text-green-400 mb-4">Recent Submissions</h2>
              <p className="text-gray-300 mb-4">These users have recently submitted words:</p>
              
              <div className="space-y-2">
                {[
                  { name: 'Alex', word: '?????', date: '2 hours ago' },
                  { name: 'Jordan', word: '?????', date: '5 hours ago' },
                  { name: 'Taylor', word: '?????', date: '1 day ago' },
                ].map((submission, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-800/60 p-3 rounded">
                    <div className="flex items-center">
                      <span className="w-8 h-8 flex items-center justify-center bg-gray-700 rounded-full mr-3">
                        {submission.name.charAt(0)}
                      </span>
                      <div>
                        <span className="block">{submission.name}</span>
                        <span className="text-xs text-gray-400">{submission.date}</span>
                      </div>
                    </div>
                    <span className="font-mono text-green-400">{submission.word}</span>
                  </div>
                ))}
              </div>
              
              {status === 'authenticated' && (
                <div className="mt-6 text-center">
                  <Link href="/submit-wordle" className="nav-btn px-6 py-2 rounded-full inline-block hover:scale-105 transition-transform">
                    Submit Your Word
                  </Link>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </div>
    </PageLayout>
  );
} 