'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useSearchParams, useRouter } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';

export default function LoginClient() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();

  const justRegistered = searchParams.get('registered') === 'true';
  const authError      = searchParams.get('error');

  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isSubmitting,       setIsSubmitting]       = useState(false);
  const [loginError,         setLoginError]         = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  useEffect(() => {
    if (status === 'authenticated' && session && searchParams.get('force') === 'redirect') {
      router.push('/dashboard');
    }
  }, [status, session, router, searchParams]);

  useEffect(() => {
    if (justRegistered) {
      setShowSuccessMessage(true);
      const t = setTimeout(() => setShowSuccessMessage(false), 5000);
      return () => clearTimeout(t);
    }
    if (authError) {
      setLoginError(
        authError === 'CredentialsSignin' ? 'Invalid email or password' : 'Authentication error',
      );
    }
  }, [justRegistered, authError]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (loginError) setLoginError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsSubmitting(true);
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: formData.email,
        password: formData.password,
        callbackUrl: '/dashboard',
      });
      if (result?.error) {
        setLoginError(
          result.error === 'CredentialsSignin' ? 'Invalid email or password' : result.error,
        );
      } else if (result?.url) {
        router.push('/dashboard');
      }
    } catch {
      setLoginError('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === 'authenticated' && session) {
    return <></>;
  }
  if (status === 'loading') {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
        <p className="mt-4 text-gray-400">Checking login status...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20">
      <div className="w-full max-w-md">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }} className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-3xl blur-3xl -z-10" />

          <div className="bg-gray-900/70 backdrop-blur-md border border-gray-800 rounded-2xl p-8 shadow-xl">
            <div className="text-center mb-8">
              <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300">
                Welcome Back
              </motion.h2>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="mt-2 text-gray-400">
                Sign in to your account
              </motion.p>
            </div>

            {showSuccessMessage && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                          className="mb-6 p-3 bg-green-500/20 border border-green-500/30 rounded-lg">
                <p className="text-green-200 text-center text-sm">
                  Your account has been created successfully! Please log in.
                </p>
              </motion.div>
            )}

            {loginError && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
                {loginError}
              </div>
            )}

            <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                  Email Address
                </label>
                <input id="email" name="email" type="email" required value={formData.email}
                       onChange={handleChange}
                       className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500" />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                    Password
                  </label>
                  <Link href="#" className="text-xs text-gray-400 hover:text-gray-300">Forgot password?</Link>
                </div>
                <input id="password" name="password" type="password" required value={formData.password}
                       onChange={handleChange}
                       className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500" />
              </div>

              <div className="pt-4">
                <button type="submit" disabled={isSubmitting}
                        className={`w-full bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-600 hover:to-gray-800 text-white font-medium py-3 px-4 rounded-xl transition-all duration-300 shadow-lg ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}>
                  {isSubmitting ? 'Signing In…' : 'Sign In'}
                </button>
              </div>
            </motion.form>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.6 }} className="mt-6 text-center">
              <p className="text-gray-400 text-sm">
                Don&apos;t have an account?{' '}
                <Link href="/signup" className="text-gray-300 hover:text-white font-medium">
                  Sign up
                </Link>
              </p>
            </motion.div>
          </div>
        </motion.div>

        <motion.div className="absolute top-20 right-10 w-20 h-20 rounded-full bg-purple-500/10 blur-3xl"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                    transition={{ duration: 5, repeat: Infinity, repeatType: 'reverse' }} />
        <motion.div className="absolute bottom-20 left-10 w-20 h-20 rounded-full bg-blue-500/10 blur-3xl"
                    animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 7, repeat: Infinity, repeatType: 'reverse' }} />
      </div>
    </div>
  );
}