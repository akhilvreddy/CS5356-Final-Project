'use client';

import PageLayout from '@/components/PageLayout';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function LearnPage() {
  const features = [
    {
      title: "Sign Up & Log In",
      description: "Create your account to start using Wordle Circles. A simple, secure process gets you set up in seconds.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      )
    },
    {
      title: "Your Dashboard",
      description: "Once logged in, your personalized dashboard displays all your Wordle Circles, making it easy to keep track of your groups.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="3" y1="9" x2="21" y2="9"></line>
          <line x1="9" y1="21" x2="9" y2="9"></line>
        </svg>
      )
    },
    {
      title: "Create or Join Circles",
      description: "Start your own circle and invite friends via a unique hash key, or join existing circles by entering a key shared with you.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="16"></line>
          <line x1="8" y1="12" x2="16" y2="12"></line>
        </svg>
      )
    },
    {
      title: "View Your Circles",
      description: "Each circle on your dashboard shows fellow members, creating a community of Wordle enthusiasts.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      )
    },
    {
      title: "Track Performance",
      description: "Click on any circle to see detailed stats of how well others did on their daily Wordle and compare your skills.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="20" x2="18" y2="10"></line>
          <line x1="12" y1="20" x2="12" y2="4"></line>
          <line x1="6" y1="20" x2="6" y2="14"></line>
          <line x1="1" y1="20" x2="23" y2="20"></line>
        </svg>
      )
    }
  ];

  return (
    <PageLayout>
      <div className="bg-black text-gray-200 pt-24 px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-4xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300"
          >
            How Wordle Circles Works
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-center text-gray-400 mb-16"
          >
            Wordle Circles brings friends together through the popular word game, allowing you to share and compare your Wordle results with your closest circles.
          </motion.p>
          
          <div className="space-y-12">
            {/* Main features */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              {features.map((feature, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                  className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 hover:bg-gray-800/50 transition-colors duration-300"
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-gradient-to-br from-gray-700 to-gray-900 p-3 rounded-lg text-gray-100">
                      {feature.icon}
                    </div>
                    <div className="ml-4">
                      <h3 className="text-xl font-semibold text-gray-100 mb-2">{feature.title}</h3>
                      <p className="text-gray-400">{feature.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
            
            {/* App Integration */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="border-t border-gray-800 pt-12 mt-16"
            >
              <h2 className="text-3xl font-bold text-center mb-8 text-gray-100">App Integration</h2>
              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-8">
                <div className="flex flex-col md:flex-row items-center">
                  <div className="mb-6 md:mb-0 md:mr-8 flex-shrink-0">
                    <div className="bg-gray-800 p-4 rounded-xl max-w-[200px]">
                      <div className="rounded-lg bg-gray-700 p-3 text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                          <line x1="8" y1="21" x2="16" y2="21"></line>
                          <line x1="12" y1="17" x2="12" y2="21"></line>
                        </svg>
                        <p className="mt-3 text-sm text-gray-300">Wordle Circles App</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-gray-100">Direct App Integration</h3>
                    <p className="text-gray-400 mb-4">
                      For a more integrated experience, you can submit your Wordle results directly through our app interface.
                    </p>
                    <p className="text-gray-400 mb-4">
                      After completing your daily Wordle puzzle, simply open the Wordle Circles app, navigate to "Submit Score," and paste or manually enter your results.
                    </p>
                    <div className="bg-gray-800 rounded-lg p-4 mb-3">
                      <div className="flex items-center mb-2 border-b border-gray-700 pb-2">
                        <div className="bg-gray-700 rounded-full w-8 h-8 flex items-center justify-center mr-3">
                          <span className="text-xs text-gray-300">1</span>
                        </div>
                        <p className="text-gray-300 text-sm">Select "Submit Today's Wordle" from your dashboard</p>
                      </div>
                      {/* <div className="flex items-center mb-2 border-b border-gray-700 pb-2">
                        <div className="bg-gray-700 rounded-full w-8 h-8 flex items-center justify-center mr-3">
                          <span className="text-xs text-gray-300">2</span>
                        </div>
                        <p className="text-gray-300 text-sm">Choose the circle(s) you want to share with</p>
                      </div> */}
                      <div className="flex items-center">
                        <div className="bg-gray-700 rounded-full w-8 h-8 flex items-center justify-center mr-3">
                          <span className="text-xs text-gray-300">2</span>
                        </div>
                        <p className="text-gray-300 text-sm">Paste or input your Wordle results and hit "Share"</p>
                      </div>
                    </div>
                    <p className="text-gray-400 text-sm">The app automatically recognizes the Wordle pattern and updates your statistics across all selected circles.</p>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* SMS Integration */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.9 }}
              className="border-t border-gray-800 pt-12 mt-16"
            >
              <h2 className="text-3xl font-bold text-center mb-8 text-gray-100">SMS Integration - Coming Soon!</h2>
              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-8">
                <div className="flex flex-col md:flex-row items-center">
                  <div className="mb-6 md:mb-0 md:mr-8 flex-shrink-0">
                    <div className="bg-gray-800 p-4 rounded-xl max-w-[200px]">
                      <div className="rounded-lg bg-gray-700 p-3 text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                        </svg>
                        <p className="mt-3 text-sm text-gray-300">Wordle Circle Buddy</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-gray-100">Meet Your Wordle Circle Buddy</h3>
                    <p className="text-gray-400 mb-4">
                      When you create an account, you'll receive a text message from your new "Wordle Circle Buddy." Save this contact to your phone for easy access.
                    </p>
                    <p className="text-gray-400 mb-4">
                      Simply text your daily Wordle results to your Buddy, and they'll be automatically shared with all your circles. No need to manually update your scores!
                    </p>
                    <div className="p-4 bg-gray-800 rounded-lg text-gray-300 font-mono text-sm">
                      <p>👋 Hi there! I'm your Wordle Circle Buddy. Save my number to share your daily Wordle scores!</p>
                      <p className="mt-2">Just send me your results like this:</p>
                      <p className="mt-2 text-green-500">Wordle 455 3/6</p>
                      <p className="text-green-500">⬜⬜⬜🟨⬜</p>
                      <p className="text-green-500">⬜🟨🟨⬜⬜</p>
                      <p className="text-green-500">🟩🟩🟩🟩🟩</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Ready to start */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1 }}
              className="text-center mt-16"
            >
              <h2 className="text-2xl font-bold mb-6 text-gray-100">Ready to start sharing your Wordle journey?</h2>
              <Link href="/signup" className="nav-btn bg-white/10 hover:bg-white/15 hover:scale-105 transform transition-transform duration-200 inline-block">
                Create Your Account
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
} 