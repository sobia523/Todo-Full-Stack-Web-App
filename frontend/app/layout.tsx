import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from '../components/auth/auth-provider';
import { ReactQueryProvider } from '../providers/react-query-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Todo App',
  description: 'A todo application with JWT-based authentication',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-[#09090b] text-[#fafafa] selection:bg-indigo-500/30`}>
        <ReactQueryProvider>
          <AuthProvider>
            <div className="relative min-h-screen flex flex-col bg-background/50">
              {children}
            </div>
          </AuthProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}