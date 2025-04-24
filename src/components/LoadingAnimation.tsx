'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function LoadingAnimation({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2800);
    
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 40);
    
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [onComplete]);

  // Wordle green color for all letters
  const wordleGreen = "#6aaa64";
  const wordleLetters = ["W", "O", "R", "D", "L", "E"];
  
  return (
    <motion.div 
      initial={{ opacity: 1 }}
      animate={{ opacity: progress === 100 ? 0 : 1 }}
      transition={{ duration: 0.6 }}
      className="fixed inset-0 flex flex-col items-center justify-center bg-black z-50"
    >
      <div className="relative mb-16">
        <motion.div
          initial={{ scale: 0, rotate: 0 }}
          animate={{ 
            scale: [0, 1.2, 1],
            rotate: [0, 90, 0, -90, 0]
          }}
          transition={{
            duration: 2.5,
            ease: "easeInOut",
            times: [0, 0.2, 0.5, 0.8, 1],
            repeat: Infinity,
            repeatDelay: 0.5
          }}
          className="flex items-center justify-center"
        >
          <div className="grid grid-cols-6 gap-2">
            {wordleLetters.map((letter, i) => (
              <motion.div
                key={i}
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ backgroundColor: wordleGreen }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: [0, 1.2, 1],
                  opacity: 1,
                  y: [0, -10, 0, 10, 0]
                }}
                transition={{
                  duration: 1.5,
                  delay: i * 0.15,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              >
                <motion.span
                  className="text-white font-bold text-lg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.15 + 0.3 }}
                >
                  {letter}
                </motion.span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
      
      <div className="w-64 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <motion.div 
          className="h-full bg-green-600 dark:bg-green-500 rounded-full"
          initial={{ width: '0%' }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>
      <motion.p 
        className="mt-4 text-sm text-gray-300 font-medium"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {progress < 100 ? 'Loading Wordle Circles...' : 'Welcome!'}
      </motion.p>
    </motion.div>
  );
} 