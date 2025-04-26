'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PageLayout from '@/components/PageLayout';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

export default function JoinCirclePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [inviteCode, setInviteCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  // Handle auth status
  if (status === 'loading') {
    return (
      <PageLayout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center">
          <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-400">Loading...</p>
        </div>
      </PageLayout>
    );
  }

  if (status === 'unauthenticated') {
    redirect('/login?callbackUrl=/join-circle');
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    const codeToSubmit = inviteCode.trim();
    if (!codeToSubmit) {
      setFormError('Invite code cannot be empty.');
      return;
    }
    // Basic check for likely code length (optional)
    // if (codeToSubmit.length !== 8) {
    //   setFormError('Invalid code format.');
    //   return;
    // }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/join-circle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: codeToSubmit }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to join circle.');
      }

      setFormSuccess(data.message || 'Successfully joined circle! Redirecting...');
      setInviteCode(''); // Clear input
      
      // Redirect to the dashboard after a short delay
      setTimeout(() => {
        router.push('/dashboard'); 
      }, 2000);

    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
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
            {/* Background glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 via-cyan-500/10 to-sky-500/10 rounded-3xl blur-3xl -z-10"></div>
            
            {/* Card content */}
            <div className="bg-gray-900/70 backdrop-blur-md border border-gray-800 rounded-2xl p-8 shadow-xl">
              <div className="text-center mb-8">
                <motion.h2
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300"
                >
                  Join a Circle
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="mt-2 text-gray-400"
                >
                  Enter the invite code shared by your friend.
                </motion.p>
              </div>

              {formSuccess && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-3 bg-green-500/20 border border-green-500/30 rounded-lg"
                >
                  <p className="text-green-200 text-center text-sm">{formSuccess}</p>
                </motion.div>
              )}

              {formError && (
                <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
                  {formError}
                </div>
              )}

              <motion.form
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                <div>
                  <label htmlFor="inviteCode" className="block text-sm font-medium text-gray-300 mb-2">
                    Invite Code:
                  </label>
                  <input
                    id="inviteCode"
                    name="inviteCode"
                    type="text"
                    required
                    value={inviteCode}
                    onChange={(e) => {
                      setInviteCode(e.target.value);
                      if(formError) setFormError(''); // Clear error on change
                      if(formSuccess) setFormSuccess(''); // Clear success on change
                    }}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 font-mono tracking-widest uppercase"
                    placeholder="ABCDEFGH"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full bg-gradient-to-r from-cyan-600 to-sky-700 hover:from-cyan-500 hover:to-sky-600 text-white font-medium py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 shadow-lg ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {isSubmitting ? 'Joining...' : 'Join Circle'}
                  </button>
                </div>
              </motion.form>
            </div>
          </motion.div>
        </div>
      </div>
    </PageLayout>
  );
} 