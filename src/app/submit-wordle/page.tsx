'use client';

import { useState } from 'react';
import PageLayout from '@/components/PageLayout';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

export default function SubmitWordlePage() {
  const { data: session, status } = useSession();
  const [wordleResult, setWordleResult] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(''); // 'success' or 'error'
  const [submitMessage, setSubmitMessage] = useState('');

  // Redirect if loading or not authenticated
  if (status === 'loading') {
    return (
      <PageLayout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center">
          <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-400">Loading...</p>
        </div>
      </PageLayout>
    );
  }

  if (status === 'unauthenticated') {
    redirect('/login?callbackUrl=/submit-wordle');
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wordleResult.trim()) {
      setSubmitStatus('error');
      setSubmitMessage('Please paste your Wordle result first.');
      return;
    }
    
    // --- Parsing Logic --- 
    const lines = wordleResult.trim().split('\n');
    let guesses = NaN;
    let rawResultGrid = '';

    if (lines.length < 2) {
      setSubmitStatus('error');
      setSubmitMessage('Invalid format: Missing result grid.');
      return;
    }

    // Extract guesses from the first line (e.g., "Wordle 1093 4/6")
    const firstLine = lines[0];
    const match = firstLine.match(/\b(\d+)\/6\b/);
    if (match && match[1]) {
      guesses = parseInt(match[1], 10);
    } else {
      setSubmitStatus('error');
      setSubmitMessage('Invalid format: Could not find guess count (e.g., 4/6).');
      return;
    }
    
    // Extract the grid (skip the first line and any empty lines immediately after)
    let gridStartIndex = 1;
    while (gridStartIndex < lines.length && lines[gridStartIndex].trim() === '') {
      gridStartIndex++;
    }
    rawResultGrid = lines.slice(gridStartIndex).join('\n').trim();

    if (!rawResultGrid) {
        setSubmitStatus('error');
        setSubmitMessage('Invalid format: Result grid is empty.');
        return;
    }
    // --- End Parsing Logic ---

    setIsSubmitting(true);
    setSubmitStatus('');
    setSubmitMessage('');

    try {
      // --- API Call --- 
      const response = await fetch('/api/submit-wordle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
            guesses: guesses, 
            rawResult: rawResultGrid 
            // userId, date, submittedAt will be handled server-side
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit result.');
      }
      // --- End API Call ---

      setSubmitStatus('success');
      setSubmitMessage(data.message || 'Wordle result submitted successfully!');
      setWordleResult(''); // Clear the textarea on success

    } catch (error) {
      setSubmitStatus('error');
      setSubmitMessage(error instanceof Error ? error.message : 'An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageLayout>
      <div className="min-h-screen bg-black flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20">
        <div className="w-full max-w-lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            {/* Background glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 via-teal-500/10 to-cyan-500/10 rounded-3xl blur-3xl -z-10"></div>
            
            {/* Card content */}
            <div className="bg-gray-900/70 backdrop-blur-md border border-gray-800 rounded-2xl p-8 shadow-xl">
              <div className="text-center mb-8">
                <motion.h2
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300"
                >
                  Submit Wordle Result
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="mt-2 text-gray-400"
                >
                  Paste your copied Wordle result below.
                </motion.p>
              </div>

              {submitStatus === 'success' && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-3 bg-green-500/20 border border-green-500/30 rounded-lg"
                >
                  <p className="text-green-200 text-center text-sm">{submitMessage}</p>
                </motion.div>
              )}

              {submitStatus === 'error' && (
                <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
                  {submitMessage}
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
                  <textarea
                    id="wordleResult"
                    name="wordleResult"
                    rows={8}
                    required
                    value={wordleResult}
                    onChange={(e) => setWordleResult(e.target.value)}
                    className="block mx-auto w-[20ch] px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 resize-none"
                    placeholder="Paste text here"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full bg-gradient-to-r from-teal-600 to-cyan-700 hover:from-teal-500 hover:to-cyan-600 text-white font-medium py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 shadow-lg ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Result'}
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