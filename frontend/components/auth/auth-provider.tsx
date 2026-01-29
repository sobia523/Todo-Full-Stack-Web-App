'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { apiClient } from '@/lib/api/api-client';

interface AuthContextType {
  user: any;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Initialize to true

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('auth-token');
      const storedUser = localStorage.getItem('auth-user');

      if (storedToken && storedUser) {
        setToken(storedToken);
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          console.error('Failed to parse stored user data', e);
          setUser(null);
          setToken(null);
          localStorage.removeItem('auth-token');
          localStorage.removeItem('auth-user');
        }
      }
    }
    setIsLoading(false); // Set to false after initial check
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const result = await apiClient.login({ email, password });
      if (result.success && result.data) {
        setToken(result.data.token);
        setUser(result.data.user); // Assuming result.data contains user object
        localStorage.setItem('auth-token', result.data.token);
        localStorage.setItem('auth-user', JSON.stringify(result.data.user));
      } else {
        throw new Error(result.error?.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      setIsLoading(true);
      const result = await apiClient.register({ name, email, password });
      if (result.success && result.data) {
        setToken(result.data.token);
        setUser(result.data.user); // Assuming result.data contains user object
        localStorage.setItem('auth-token', result.data.token);
        localStorage.setItem('auth-user', JSON.stringify(result.data.user));
      } else {
        throw new Error(result.error?.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('auth-token');
    localStorage.removeItem('auth-user');
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, isAuthenticated, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};