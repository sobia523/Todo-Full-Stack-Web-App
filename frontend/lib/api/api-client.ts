import { signIn, signUp, signOut, useSession, authClient } from '../auth/auth-client';
import { UserSession, LoginCredentials, RegisterUserData } from '../../types/auth';
import { Task, TaskFormData, ApiResponse, TaskListResponse } from '../../types/task';

export class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    // Get the session to access the JWT token - DIRECT READ FROM STORAGE
    // We prioritize direct storage read to ensure the token is attached immediately
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth-token') : null;

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Add authorization header if user is authenticated
    if (token) {
      console.log('Attaching token to request:', token.substring(0, 10) + '...');
      headers['Authorization'] = `Bearer ${token}`;
    } else {
      console.warn('No token found in session for request to:', endpoint);
    }

    let response;
    try {
      console.log(`Fetching ${url}...`);
      response = await fetch(url, {
        headers,
        ...options,
      });
    } catch (networkError: any) {
      console.error('Network error during fetch:', networkError);
      throw new Error('Network error: Failed to connect to server. Please ensure the backend is running.');
    }

    if (response.status === 401) {
      localStorage.removeItem('auth-token');
      localStorage.removeItem('auth-user');
      window.location.href = '/auth/sign-in';
      throw new Error('Unauthorized - please log in');
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error?.message || `API error! status: ${response.status}`);
    }

    return result.data;
  }

  // Authentication methods using Better Auth
  async login(credentials: LoginCredentials): Promise<ApiResponse<UserSession>> {
    return signIn(credentials);
  }

  async register(userData: RegisterUserData): Promise<ApiResponse<UserSession>> {
    return signUp(userData);
  }

  async logout(): Promise<void> {
    return signOut();
  }

  async getCurrentUser(): Promise<ApiResponse<UserSession>> {
    const session = await authClient.getSession();
    if (!session) {
      throw new Error('User not authenticated');
    }
    return { data: session.user, success: true };
  }

  // Task methods
  async getTasks(): Promise<TaskListResponse> {
    return this.request<TaskListResponse>('/tasks');
  }

  async getTask(id: number): Promise<Task> {
    return this.request<Task>(`/tasks/${id}`);
  }

  async createTask(taskData: TaskFormData): Promise<Task> {
    return this.request<Task>('/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData),
    });
  }

  async updateTask(id: number, taskData: Partial<Task>): Promise<Task> {
    return this.request<Task>(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(taskData),
    });
  }

  async deleteTask(id: number): Promise<void> {
    return this.request<void>(`/tasks/${id}`, {
      method: 'DELETE',
    });
  }

  async toggleTaskCompletion(id: number, completed: boolean): Promise<Task> {
    return this.request<Task>(`/tasks/${id}/toggle`, {
      method: 'POST',
      body: JSON.stringify({ completed }),
    });
  }
}

export const apiClient = new ApiClient();