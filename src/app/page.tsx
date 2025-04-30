'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import LoadingAnimation from '@/components/LoadingAnimation';

export default function Home() {
  const [loading, setLoading] = useState(true);

  const handleLoadingComplete = () => {
    setLoading(false);
  };

  return (
    <>
      {loading && <LoadingAnimation onComplete={handleLoadingComplete} />}
      
      <div className="min-h-screen flex flex-col items-center justify-center bg-black">
        {!loading && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="fixed top-0 left-0 right-0 flex justify-between items-center p-6 z-20"
          >
            <Link href="/learn">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="nav-btn"
              >
                Learn More
              </motion.button>
            </Link>
            
            <div className="flex space-x-4">
              <Link href="/signup">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="nav-btn"
                >
                  Sign Up
                </motion.button>
              </Link>
              <Link href="/login">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="nav-btn bg-white/10 hover:bg-white/15"
                >
                  Log In
                </motion.button>
              </Link>
            </div>
          </motion.div>
        )}
        
        {!loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center z-10 relative"
          >
            <motion.h1 
              className="text-5xl md:text-7xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300 drop-shadow-[0_0_15px_rgba(255,255,255,0.15)]"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ 
                type: "spring", 
                stiffness: 200, 
                damping: 15,
                delay: 0.4
              }}
            >
              Wordle Circles
            </motion.h1>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="mt-8 text-gray-400 text-sm flex justify-center space-x-6"
            >
              <span className="px-3 py-1 rounded-full bg-gray-900/40 backdrop-blur-sm">Akhil</span>
              <span className="px-3 py-1 rounded-full bg-gray-900/40 backdrop-blur-sm">Dennis</span>
              <span className="px-3 py-1 rounded-full bg-gray-900/40 backdrop-blur-sm">Rishab</span>
            </motion.div>
          </motion.div>
        )}
        
        {!loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.2 }}
            className="fixed bottom-6 flex justify-center w-full z-10"
          >
            <a 
              href="https://github.com/akhilvreddy/CS5356-Final-Project" 
          target="_blank"
          rel="noopener noreferrer"
              className="flex items-center space-x-2 bg-gray-900/30 backdrop-blur-sm px-3 py-2 rounded-full hover:bg-gray-800/40 transition-colors duration-300"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="text-gray-300"
        >
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
              </svg>
              <span className="text-xs text-gray-300">GitHub</span>
            </a>
          </motion.div>
        )}
        
        {!loading && (
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full opacity-30"
                style={{
                  width: `${Math.random() * 100 + 50}px`,
                  height: `${Math.random() * 100 + 50}px`,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  backgroundColor: `hsl(${Math.random() * 360}, 70%, 60%)`,
                }}
                initial={{ scale: 0 }}
                animate={{ 
                  scale: 1,
                  x: [0, Math.random() * 100 - 50],
                  y: [0, Math.random() * 100 - 50],
                }}
                transition={{ 
                  scale: { delay: 1 + i * 0.1, duration: 0.8 },
                  x: { 
                    repeat: Infinity, 
                    repeatType: "reverse", 
                    duration: 20 + Math.random() * 10,
                    delay: i * 0.5
                  },
                  y: { 
                    repeat: Infinity, 
                    repeatType: "reverse", 
                    duration: 20 + Math.random() * 10,
                    delay: i * 0.5
                  }
                }}
              />
            ))}
          </div>
        )}
    </div>
    </>
  );
}
