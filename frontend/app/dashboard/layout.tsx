'use client';

import dynamic from 'next/dynamic';
import { useAuth } from "@/components/auth/auth-provider";

const ProtectedRoute = dynamic(() => import("../../components/protected-route"), { ssr: false });
const LogoutButton = dynamic(() => import("../../components/auth/LogoutButton"), { ssr: false });

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const { logout } = useAuth(); // No longer needed here, handled by LogoutButton

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col selection:bg-indigo-500/30">
        {/* Modern Sticky Navigation */}
        <nav className="sticky top-0 z-50 border-b border-white/5 bg-zinc-950/50 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              {/* Logo Area */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl premium-gradient flex items-center justify-center shadow-lg shadow-indigo-500/20 group cursor-pointer transition-transform hover:scale-105 active:scale-95">
                  <svg className="w-5 h-5 text-white transform group-hover:rotate-12 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-black tracking-tighter leading-none">
                    TODO<span className="text-indigo-500">PRO</span>
                  </span>
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Workspace</span>
                </div>
              </div>

              {/* Navigation Links */}
              <div className="flex items-center gap-1 sm:gap-2">
                <a
                  href="/dashboard/tasks"
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-zinc-400 hover:text-white hover:bg-white/5 transition-all flex items-center gap-2 group"
                >
                  <svg className="w-4 h-4 text-zinc-500 group-hover:text-indigo-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                  </svg>
                  <span className="hidden sm:inline">Tasks</span>
                </a>

                <div className="w-[1px] h-4 bg-white/10 mx-2" />

                {/* Use dynamically imported LogoutButton */}
                <LogoutButton />
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content Area */}
        <main className="flex-1 overflow-x-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {children}
          </div>
        </main>

        {/* Subtle decorative background elements */}
        <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
          <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] rounded-full bg-indigo-600/5 blur-[120px] animate-pulse" />
          <div className="absolute bottom-[20%] left-[10%] w-[30%] h-[30%] rounded-full bg-violet-600/5 blur-[120px] animate-pulse" />
        </div>
      </div>
    </ProtectedRoute>
  );
}