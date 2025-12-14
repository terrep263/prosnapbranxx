'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';

interface AuthGateProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export default function AuthGate({ children, redirectTo = '/login' }: AuthGateProps) {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const authStatus = isAuthenticated();
      setAuthenticated(authStatus);
      
      if (!authStatus) {
        router.push(redirectTo);
      }
    };

    checkAuth();
    
    // Check auth status periodically (every 5 seconds) to catch logout
    const interval = setInterval(checkAuth, 5000);
    
    return () => clearInterval(interval);
  }, [router, redirectTo]);

  if (authenticated === null) {
    // Loading state
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-brand-red border-t-transparent rounded-full animate-spin" />
          <div className="text-gray-600 font-medium">Loading...</div>
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return null; // Will redirect via useEffect
  }

  return <>{children}</>;
}
