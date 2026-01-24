'use client';

import { useAuth } from '@/lib/auth/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';

export default function LogoutButton() {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/auth/sign-in');
  };

  return (
    <Button onClick={handleLogout} variant="outline">
      Logout
    </Button>
  );
}