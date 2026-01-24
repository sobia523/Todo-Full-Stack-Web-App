import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ProtectedRoute from '@/components/protected-route';

// Mock the auth client to simulate unauthenticated state
vi.mock('@/lib/auth/auth-client', () => {
  return {
    useSession: () => ({ data: null, status: 'unauthenticated' }),
  };
});

describe('Route Protection', () => {
  beforeEach(() => {
    // Mock window.location.assign to prevent actual redirects during tests
    Object.defineProperty(window, 'location', {
      value: {
        assign: vi.fn(),
      },
      writable: true,
    });
  });

  it('redirects unauthenticated users to sign-in page', () => {
    render(
      <ProtectedRoute>
        <div>Dashboard Content</div>
      </ProtectedRoute>
    );

    // Verify that the redirect function was called
    expect(window.location.assign).toHaveBeenCalledWith('/auth/sign-in');
  });
});