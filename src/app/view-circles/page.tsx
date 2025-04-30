'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import PageLayout from '@/components/PageLayout';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

interface Circle {
  id: string;
  name: string;
}

export default function ViewCirclesPage() {
  const { data: session, status } = useSession();
  const [circles, setCircles] = useState<Circle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      redirect('/login?callbackUrl=/view-circles');
    }
  }, [status]);

  useEffect(() => {
    if (status === 'authenticated') {
      setIsLoading(true);
      setError(null);
      
      const fetchCircles = async () => {
        try {
          const response = await fetch('/api/my-circles');
          if (!response.ok) {
            let errorMsg = 'Failed to fetch circles';
            try {
              const errorData = await response.json();
              errorMsg = errorData.message || errorMsg;
            } catch (jsonError) {
            }
            throw new Error(errorMsg);
          }
          const data = await response.json();
          setCircles(data.circles || []);

        } catch (err) {
          setError(err instanceof Error ? err.message : 'An unknown error occurred');
          setCircles([]);
        } finally {
          setIsLoading(false);
        }
      };

      fetchCircles();
    }
  }, [status]);

  if (status === 'loading' || (status === 'authenticated' && isLoading)) {
    return (
      <PageLayout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-400">Loading your circles...</p>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="min-h-screen bg-black pt-24 px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-4xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 mb-8 text-center"
          >
            Your Wordle Circles
          </motion.h1>

          {error && (
            <div className="mb-6 p-4 bg-red-900/50 border border-red-700 rounded-lg text-red-300 text-center">
              Error: {error}
            </div>
          )}

          {!isLoading && !error && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
            >
              {circles.length > 0 ? (
                circles.map((circle, index) => (
                  <motion.div
                    key={circle.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link 
                      href={`/circles/${circle.id}`}
                      className="block p-6 bg-gray-900/70 backdrop-blur-md border border-gray-800 rounded-2xl shadow-lg 
                                 hover:border-purple-600 hover:bg-gray-800/80 transition-all duration-300 group"
                    >
                      <h2 className="text-xl font-semibold text-gray-200 mb-2 truncate group-hover:text-purple-400 transition-colors">
                        {circle.name}
                      </h2>
                      <p className="text-sm text-gray-500 group-hover:text-gray-400 transition-colors">
                        View Circle
                      </p>
                    </Link>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full text-center py-10 px-6 bg-gray-900/70 border border-gray-800 rounded-2xl">
                  <p className="text-gray-400 mb-4">You haven't joined any circles yet.</p>
                  <div className="flex justify-center gap-4">
                    <Link href="/create-circle" className="nav-btn-secondary px-4 py-2 rounded-lg text-sm">
                      Create a Circle
                    </Link>
                    <Link href="/join-circle" className="nav-btn-secondary px-4 py-2 rounded-lg text-sm">
                      Join a Circle
                    </Link>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </PageLayout>
  );
} 