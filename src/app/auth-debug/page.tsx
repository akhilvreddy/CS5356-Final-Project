'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AuthDebugPage() {
  const { data: session, status, update } = useSession();
  const [clientTime, setClientTime] = useState(new Date().toISOString());
  const [cookieDump, setCookieDump] = useState(''); 
  
  // Update time every second to show component is rerendering
  useEffect(() => {
    const timer = setInterval(() => {
      setClientTime(new Date().toISOString());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  useEffect(() => {
    if (typeof document !== 'undefined') {
      setCookieDump(document.cookie.split(';').map(cookie => cookie.trim()).join('\n'));
    }
  }, []);

  // Force refresh the session
  const handleForceRefresh = async () => {
    await update();
    alert('Session manually refreshed!');
  };
  
  // Clear all cookies and reload page
  const handleClearCookies = () => {
    if (confirm('This will clear all cookies and reload the page. Continue?')) {
      // Set all cookies to expire immediately
      document.cookie.split(';').forEach(cookie => {
        const [name] = cookie.trim().split('=');
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
      });
      // Reload page
      window.location.reload();
    }
  };
  
  return (
    <div className="min-h-screen bg-black pt-16 px-4">
      <div className="max-w-2xl mx-auto mt-8 p-4 bg-gray-900 rounded-lg">
        <h1 className="text-2xl font-bold mb-4 text-white">Authentication Debug</h1>
        
        <div className="bg-black p-4 rounded mb-4">
          <h2 className="text-xl font-semibold mb-2 text-white">Session Status</h2>
          <div className="font-mono text-lg">
            <span className="text-green-500">Status:</span> 
            <span className={`ml-2 ${
              status === 'authenticated' ? 'text-green-400' : 
              status === 'loading' ? 'text-yellow-400' : 'text-red-400'
            }`}>
              {status}
            </span>
          </div>
        </div>
        
        <div className="bg-black p-4 rounded mb-4">
          <h2 className="text-xl font-semibold mb-2 text-white">Session Data</h2>
          <pre className="font-mono text-xs overflow-auto p-2 bg-gray-950 rounded max-h-60">
            {JSON.stringify(session, null, 2)}
          </pre>
        </div>
        
        <div className="bg-black p-4 rounded mb-4">
          <h2 className="text-xl font-semibold mb-2 text-white">Client Time</h2>
          <div className="font-mono">{clientTime}</div>
          <p className="text-gray-500 text-sm mt-1">This updates every second to verify the component is rerendering correctly.</p>
        </div>
        
        <div className="bg-black p-4 rounded mb-4">
          <h2 className="text-xl font-semibold mb-2 text-white">Cookies</h2>
          <pre className="font-mono text-xs overflow-auto p-2 bg-gray-950 rounded max-h-60">
            {/* {document.cookie.split(';').map(cookie => cookie.trim()).join('\n')} */}
            {cookieDump}
          </pre>
        </div>
        
        <div className="bg-black p-4 rounded mb-4">
          <h2 className="text-xl font-semibold mb-2 text-white">Auth Actions</h2>
          <div className="flex flex-wrap gap-3">
            <button 
              onClick={handleForceRefresh}
              className="px-4 py-2 bg-green-800 text-white rounded hover:bg-green-700 transition-colors"
            >
              Force Refresh Session
            </button>
            
            <button 
              onClick={() => signIn()}
              className="px-4 py-2 bg-blue-800 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Sign In
            </button>
            
            <button 
              onClick={() => signOut()}
              className="px-4 py-2 bg-red-800 text-white rounded hover:bg-red-700 transition-colors"
            >
              Sign Out
            </button>
            
            <button 
              onClick={handleClearCookies}
              className="px-4 py-2 bg-yellow-800 text-white rounded hover:bg-yellow-700 transition-colors"
            >
              Clear All Cookies
            </button>
          </div>
        </div>
        
        <div className="flex gap-4 mt-6">
          <Link 
            href="/"
            className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors"
          >
            Back to Home
          </Link>
          
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
          >
            Refresh Page
          </button>
        </div>
      </div>
    </div>
  );
} 