'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PageLayout from '@/components/PageLayout';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

export default function CreateCirclePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [circleName, setCircleName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  if (status === 'loading') {
    return (
      <PageLayout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-400">Loading...</p>
        </div>
      </PageLayout>
    );
  }

  if (status === 'unauthenticated') {
    redirect('/login?callbackUrl=/create-circle');
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!circleName.trim()) {
      setFormError('Circle name cannot be empty.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/create-circle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: circleName }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create circle.');
      }
      
      setInviteCode(data.inviteCode || ''); 
      setFormSuccess(`Circle '${circleName}' created successfully! Share the code below:`);
      setCircleName('');

    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopy = () => {
    if (!inviteCode) return;
    navigator.clipboard.writeText(inviteCode).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }).catch(err => {
      console.error('Failed to copy invite code: ', err);
    });
  };

  return (
    <PageLayout>
      <div className="min-h-screen bg-black flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20">
        <div className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-indigo-500/10 to-blue-500/10 rounded-3xl blur-3xl -z-10"></div>
            
            <div className="bg-gray-900/70 backdrop-blur-md border border-gray-800 rounded-2xl p-8 shadow-xl">
              <div className="text-center mb-8">
                <motion.h2
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300"
                >
                  Create New Circle
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="mt-2 text-gray-400"
                >
                  Start a new Wordle Circle with your friends.
                </motion.p>
              </div>

              {formSuccess && inviteCode && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-lg text-center"
                >
                  <p className="text-green-200 text-sm mb-3">{formSuccess}</p>
                  <div className="flex items-center justify-center space-x-3 bg-gray-800/50 px-4 py-2 rounded-lg">
                    <p className="text-lg font-mono font-bold text-green-300 tracking-widest">
                      {inviteCode}
                    </p>
                    <button
                      onClick={handleCopy}
                      className={`px-3 py-1 rounded transition-colors duration-200 text-xs 
                                  ${isCopied 
                                    ? 'bg-green-600 text-white cursor-default' 
                                    : 'bg-gray-700 hover:bg-gray-600 text-gray-300'}`}
                      disabled={isCopied}
                    >
                      {isCopied ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </motion.div>
              )}

              {formError && (
                <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
                  {formError}
                </div>
              )}

              {!inviteCode && (
                <motion.form
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  onSubmit={handleSubmit}
                  className="space-y-6"
                >
                  <div>
                    <label htmlFor="circleName" className="block text-sm font-medium text-gray-300 mb-2">
                      Circle Name:
                    </label>
                    <input
                      id="circleName"
                      name="circleName"
                      type="text"
                      required
                      value={circleName}
                      onChange={(e) => {
                        setCircleName(e.target.value);
                        if(formError) setFormError(''); 
                        if(formSuccess) setFormSuccess(''); 
                      }}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                      placeholder="E.g., Family Wordlers, Office Champs"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full bg-gradient-to-r from-indigo-600 to-blue-700 hover:from-indigo-500 hover:to-blue-600 text-white font-medium py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-lg ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                      {isSubmitting ? 'Creating...' : 'Create Circle'}
                    </button>
                  </div>
                </motion.form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </PageLayout>
  );
} 