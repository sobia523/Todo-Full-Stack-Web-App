'use client';

import { useAuth } from '@/components/auth/auth-provider';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  fallback?: ReactNode;
  redirectTo?: string;
}

export default function ProtectedRoute({
  children,
  fallback = null,
  redirectTo = '/auth/sign-in'
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (hasMounted && !authLoading && !isAuthenticated) {
      router.push(redirectTo);
    }
  }, [hasMounted, authLoading, isAuthenticated, router, redirectTo]);

  if (!hasMounted || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#09090b]">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 rounded-xl premium-gradient flex items-center justify-center mx-auto shadow-lg shadow-indigo-500/20 animate-spin">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Syncing Workspace...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return fallback;
  }

  return <>{children}</>;
}