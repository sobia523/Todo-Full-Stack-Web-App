import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ApiClient } from '@/lib/api/api-client';
import { SignUpForm } from '@/components/auth/signup-form';
import { SignInForm } from '@/components/auth/signin-form';

// Mock the API client
const mockLogin = vi.fn();
const mockRegister = vi.fn();

vi.mock('@/lib/api/api-client', () => {
  return {
    ApiClient: vi.fn().mockImplementation(() => ({
      login: mockLogin,
      register: mockRegister,
    })),
    apiClient: {
      login: mockLogin,
      register: mockRegister,
    }
  };
});

describe('Auth API Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('registers a new user successfully', async () => {
    mockRegister.mockResolvedValue({
      data: { user: { id: 1, email: 'test@example.com' }, token: 'fake-token' },
      success: true
    });

    render(<SignUpForm />);

    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });

    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      });
    });
  });

  it('logs in an existing user successfully', async () => {
    mockLogin.mockResolvedValue({
      data: { user: { id: 1, email: 'test@example.com' }, token: 'fake-token' },
      success: true
    });

    render(<SignInForm />);

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });

    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123'
      });
    });
  });
});