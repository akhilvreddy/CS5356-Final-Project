'use client';

import SimplePageLayout from '@/components/SimplePageLayout';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

export default function TestLayoutPage() {
  const { data: session, status } = useSession();
  
  // Log session changes - debugging only
  useEffect(() => {
    console.log('Auth status:', status);
    console.log('Session data:', session);
  }, [session, status]);
  
  return (
    <SimplePageLayout>
      <div className="max-w-3xl mx-auto mt-8 p-6 bg-gray-900 rounded-lg">
        <h1 className="text-2xl font-bold mb-6">Test Layout Page</h1>
        
        <div className="space-y-6">
          <div className="p-4 bg-gray-800 rounded-lg">
            <h2 className="text-xl font-bold mb-3">Authentication Status</h2>
            <div className="font-mono">
              Status: <span className={`font-bold ${
                status === 'authenticated' ? 'text-green-400' : 
                status === 'loading' ? 'text-yellow-400' : 'text-red-400'
              }`}>{status}</span>
            </div>
          </div>
          
          {status === 'authenticated' && session && (
            <div className="p-4 bg-gray-800 rounded-lg">
              <h2 className="text-xl font-bold mb-3">Your Profile</h2>
              <div className="space-y-2">
                <div>Name: {session.user?.name || 'Not provided'}</div>
                <div>Email: {session.user?.email || 'Not provided'}</div>
              </div>
            </div>
          )}
          
          {status === 'unauthenticated' && (
            <div className="p-4 bg-red-900/50 border border-red-800 rounded-lg">
              <h2 className="text-xl font-bold mb-3">Not Logged In</h2>
              <p>Please log in to see your profile information.</p>
            </div>
          )}
        </div>
      </div>
    </SimplePageLayout>
  );
} 