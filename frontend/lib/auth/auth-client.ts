import { UserSession, LoginCredentials, RegisterUserData } from '../../types/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';

export const authClient = {
  signIn: async (credentials: LoginCredentials) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Login failed' }));
        let message = 'Login failed';

        if (typeof errorData.detail === 'string') {
          message = errorData.detail;
        } else if (Array.isArray(errorData.detail)) {
          message = errorData.detail.map((e: any) => `${e.loc.join('.')}: ${e.msg}`).join(', ');
        } else if (errorData.message) {
          message = errorData.message;
        }

        throw new Error(message);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error?.message || 'Login failed');
      }

      const data = result.data;

      // Extract token and user info
      const token = data.access_token;
      const user = {
        id: data.user.id,
        email: data.user.email,
        name: data.user.name,
        isLoggedIn: true,
        token: token,
        tokenExpiry: new Date(Date.now() + data.expires_in * 1000)
      };

      // Store in localStorage
      localStorage.setItem('auth-token', token);
      localStorage.setItem('auth-user', JSON.stringify(user));

      return {
        data: {
          user: {
            id: data.user.id,
            email: data.user.email,
            name: data.user.name,
          },
          token: token
        },
        success: true
      };
    } catch (error: any) {
      console.error('Sign in error:', error);
      throw error;
    }
  },

  signUp: async (userData: RegisterUserData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userData.email,
          password: userData.password,
          name: userData.name
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Registration failed' }));
        throw new Error(errorData.detail || 'Registration failed');
      }

      const user = await response.json();

      // After successful registration, log the user in
      return await authClient.signIn({
        email: userData.email,
        password: userData.password
      });
    } catch (error: any) {
      console.error('Sign up error:', error);
      throw error;
    }
  },

  signOut: async () => {
    try {
      const token = localStorage.getItem('auth-token');
      if (token) {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }).catch(() => {
          // Ignore logout errors, just clear local storage
        });
      }

      // Clear local storage
      localStorage.removeItem('auth-token');
      localStorage.removeItem('auth-user');
    } catch (error) {
      console.error('Sign out error:', error);
      // Always clear local storage even if API call fails
      localStorage.removeItem('auth-token');
      localStorage.removeItem('auth-user');
    }
  },

  getSession: async () => {
    if (typeof window === 'undefined') return null;

    const token = localStorage.getItem('auth-token');
    const userStr = localStorage.getItem('auth-user');
    let user = null;

    if (userStr) {
      try {
        user = JSON.parse(userStr);
      } catch {
        // User data corrupted, but token might still be valid
      }
    }

    if (token) {
      return { user: user || { id: '', email: '', name: '' }, token };
    }

    return null;
  },

  useSession: () => {
    if (typeof window === 'undefined') return { data: null, status: 'loading' };

    const token = localStorage.getItem('auth-token');
    const userStr = localStorage.getItem('auth-user');

    if (token) {
      try {
        const user = userStr ? JSON.parse(userStr) : null;
        return { data: { user }, status: 'authenticated' };
      } catch {
        return { data: null, status: 'unauthenticated' };
      }
    }
    return { data: null, status: 'unauthenticated' };
  }
};

// Export individual methods for easier use
export const { signIn, signUp, signOut, useSession } = authClient;