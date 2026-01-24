'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/components/auth/auth-provider';

export default function HomePage() {
  const router = useRouter();

  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        router.push('/dashboard/tasks');
      } else {
        router.push('/auth/sign-in');
      }
    }
  }, [router, isAuthenticated, isLoading]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 overflow-hidden relative">
      {/* Ambient background glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-indigo-500/20 blur-[120px] animate-pulse" />
      </div>

      <div className="text-center relative z-10 space-y-6 animate-in fade-in zoom-in duration-700">
        <div className="w-20 h-20 rounded-3xl premium-gradient flex items-center justify-center mx-auto shadow-2xl shadow-indigo-500/20 animate-bounce">
          <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-black tracking-tighter text-white">
            Todo<span className="premium-text-gradient">App</span>
          </h1>
          <div className="flex items-center justify-center space-x-2 text-zinc-500 font-medium">
            <div className="w-2 h-2 rounded-full bg-indigo-500 animate-ping"></div>
            <p>Syncing your workspace...</p>
          </div>
        </div>
      </div>
    </div>
  );
}