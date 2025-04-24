'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import LoadingAnimation from '@/components/LoadingAnimation';

export default function Home() {
  const [loading, setLoading] = useState(true);

  // Function to handle the completion of the loading animation
  const handleLoadingComplete = () => {
    setLoading(false);
  };

  return (
    <>
      {loading && <LoadingAnimation onComplete={handleLoadingComplete} />}
      
      <div className="min-h-screen flex flex-col items-center justify-center bg-black">
        {/* Top navigation */}
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
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="nav-btn"
              >
                Sign Up
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="nav-btn bg-white/10 hover:bg-white/15"
              >
                Log In
              </motion.button>
            </div>
          </motion.div>
        )}
        
        {/* Main content - Wordle Circles title */}
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
          </motion.div>
        )}
        
        {/* Floating circles in the background */}
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
