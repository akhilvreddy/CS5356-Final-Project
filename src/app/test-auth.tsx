'use client';

import { useState } from 'react';
import { signIn, useSession } from 'next-auth/react';
import PageLayout from '@/components/PageLayout';

export default function TestAuth() {
  const { data: session, status } = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [cookies, setCookies] = useState<string>('');
  
  const handleTest = async () => {
    setLoading(true);
    setResult(null);
    
    try {
      const response = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });
      
      setResult(response);
      
      if (document.cookie) {
        setCookies(document.cookie);
      }
    } catch (error) {
      setResult({ error: 'Error during sign in', details: error });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <PageLayout>
      <div className="min-h-screen bg-black pt-24 px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold mb-6 text-white">NextAuth Test</h1>
          
          <div className="mb-8 p-4 bg-gray-900 rounded-lg border border-gray-800">
            <h2 className="text-xl mb-2 text-white">Current Session Status: <span className="font-mono">{status}</span></h2>
            {session && (
              <div className="mt-4">
                <h3 className="text-lg mb-2 text-white">Session Data:</h3>
                <pre className="bg-gray-800 p-3 rounded overflow-auto text-green-400 text-sm">
                  {JSON.stringify(session, null, 2)}
                </pre>
              </div>
            )}
          </div>
          
          <div className="mb-8 p-4 bg-gray-900 rounded-lg border border-gray-800">
            <h2 className="text-xl mb-4 text-white">Test Sign In</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">Password</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white"
                />
              </div>
              <button
                onClick={handleTest}
                disabled={loading}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-white disabled:opacity-50"
              >
                {loading ? 'Testing...' : 'Test Sign In'}
              </button>
            </div>
          </div>
          
          {result && (
            <div className="mb-8 p-4 bg-gray-900 rounded-lg border border-gray-800">
              <h2 className="text-xl mb-2 text-white">Sign In Response:</h2>
              <pre className="bg-gray-800 p-3 rounded overflow-auto text-green-400 text-sm">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
          
          {cookies && (
            <div className="mb-8 p-4 bg-gray-900 rounded-lg border border-gray-800">
              <h2 className="text-xl mb-2 text-white">Cookies:</h2>
              <pre className="bg-gray-800 p-3 rounded overflow-auto text-green-400 text-sm">
                {cookies.split(';').map(cookie => cookie.trim()).join('\n')}
              </pre>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
} 