'use client';

import { SessionProvider } from "next-auth/react";
import { useEffect, useState } from "react";

export default function AuthProvider({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  // Wait until client side to avoid hydration issues
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  return (
    <SessionProvider 
      // Set session to null by default to prevent automatic login
      session={null}
      // Disable automatic session retrieval
      refetchInterval={0}
      refetchOnWindowFocus={false}
      refetchWhenOffline={false}
    >
      {children}
    </SessionProvider>
  );
} 