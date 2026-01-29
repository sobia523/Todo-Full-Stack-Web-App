'use client';

import { useAuth } from '@/components/auth/auth-provider';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export default function ProtectedRoute({ children, fallback = null }: ProtectedRouteProps) {
  const { isAuthenticated, token } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check authentication status
    if (!token) {
      // Redirect to login if not authenticated
      router.push('/auth/sign-in');
    } else {
      // Check if token is still valid (simple check for now)
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Math.floor(Date.now() / 1000);

        if (payload.exp < currentTime) {
          // Token is expired, redirect to login
          localStorage.removeItem('access_token');
          router.push('/auth/sign-in');
        } else {
          // Token is valid
          setLoading(false);
        }
      } catch (e) {
        console.error('Error decoding token:', e);
        router.push('/auth/sign-in');
      }
    }
  }, [isAuthenticated, token, router]);

  if (loading) {
    return <div>Loading...</div>; // Or a spinner component
  }

  if (!isAuthenticated) {
    return fallback;
  }

  return <>{children}</>;
}