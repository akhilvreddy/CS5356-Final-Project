'use client';

import { useState, useEffect } from 'react';
import { useParams, redirect } from 'next/navigation';
import Link from 'next/link';
import PageLayout from '@/components/PageLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from 'next-auth/react';

interface CircleMemberWithScore {
  id: string;
  name: string | null;
  guesses: number | null;
  raw_result: string | null;
}

export default function CircleDetailPage() {
  const params = useParams();
  const circleId = params.circleId as string;
  const { data: session, status } = useSession();
  
  const [circleName, setCircleName] = useState<string | null>(null);
  const [members, setMembers] = useState<CircleMemberWithScore[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<CircleMemberWithScore | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      redirect(`/login?callbackUrl=/circles/${circleId}`);
    }
  }, [status, circleId]);

  useEffect(() => {
    if (status === 'authenticated' && circleId) {
      setIsLoading(true);
      setError(null);
      
      const fetchCircleData = async () => {
        try {
          const response = await fetch(`/api/circles/${circleId}`);
          
          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || `Error: ${response.statusText}`);
          }

          setCircleName(data.circleName || 'Circle Details');
          setMembers(data.members || []);

        } catch (err) {
          console.error('Failed to fetch circle data:', err);
          setError(err instanceof Error ? err.message : 'An unknown error occurred');
          setCircleName(null);
          setMembers([]);
        } finally {
          setIsLoading(false);
        }
      };

      fetchCircleData();
    }
  }, [status, circleId]);

  const renderScore = (guesses: number | null) => {
    if (guesses === null) {
      return <span className="text-xs text-gray-500 italic">Not submitted</span>;
    }
    if (guesses === 7) {
      return <span className="font-bold text-red-400">X/6</span>;
    }
    return <span className="font-bold text-green-400">{guesses}/6</span>;
  };

  const handleMemberClick = (member: CircleMemberWithScore) => {
    setSelectedMember(member);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMember(null);
  };

  if (status === 'loading' || isLoading) {
    return (
      <PageLayout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-400">Loading circle details...</p>
        </div>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout>
        <div className="min-h-screen bg-black pt-24 px-4 sm:px-6 lg:px-8 pb-20">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-2xl font-bold text-red-500 mb-4">Error Loading Circle</h1>
            <p className="text-gray-400 bg-gray-800/50 p-4 rounded-lg mb-6">{error}</p>
            <Link href="/view-circles" className="nav-btn-secondary px-4 py-2 rounded-lg text-sm">
              Back to My Circles
            </Link>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="min-h-screen bg-black pt-24 px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-2xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 mb-8 text-center"
          >
            {circleName || 'Circle Details'}
          </motion.h1>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="bg-gray-900/70 backdrop-blur-md border border-gray-800 rounded-2xl shadow-lg p-6"
          >
            <h2 className="text-xl font-semibold text-gray-300 mb-4 border-b border-gray-700 pb-2">Today's Scores</h2>
            {members.length > 0 ? (
              <ul className="space-y-3">
                {members.map((member, index) => (
                  <motion.li
                    key={member.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg"
                  >
                    <button 
                      onClick={() => handleMemberClick(member)}
                      disabled={!member.raw_result}
                      className={`text-gray-200 text-left hover:text-blue-400 transition-colors disabled:text-gray-500 disabled:cursor-not-allowed`}
                    >
                      {member.name || 'Unknown User'}
                    </button>
                    {renderScore(member.guesses)}
                  </motion.li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-center py-4">No members found in this circle.</p>
            )}
          </motion.div>

        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && selectedMember && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bg-gray-900 border border-gray-700 rounded-xl p-6 max-w-sm w-full shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-200">{selectedMember.name}'s Result</h3>
                <button onClick={closeModal} className="text-gray-500 hover:text-gray-300 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              {selectedMember.raw_result ? (
                <pre className="text-center text-sm md:text-base font-mono bg-gray-800 p-4 rounded whitespace-pre-wrap text-gray-300 leading-tight">
                  {selectedMember.raw_result}
                </pre>
              ) : (
                <p className="text-gray-400 text-center">No result submitted today.</p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageLayout>
  );
}