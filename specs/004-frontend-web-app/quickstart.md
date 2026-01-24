# Quickstart Guide: Frontend Web Application for Todo Full-Stack Web Application

**Feature**: 004-frontend-web-app | **Date**: 2026-01-17 | **Plan**: [link to plan.md](./plan.md)

## Overview

This quickstart guide provides step-by-step instructions for implementing the frontend web application for the Todo Full-Stack Web Application using Next.js 16+ with App Router and Better Auth for authentication. Follow these steps to get a responsive, multi-user task management interface up and running.

## Prerequisites

- Node.js 18+ and npm/yarn for frontend
- Git for version control
- Access to the backend API (assumed to be running)
- Basic knowledge of Next.js and React

## Environment Setup

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd Todo-Full-Stack-App
```

### 2. Set Up Frontend Environment
```bash
cd frontend
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the frontend directory:

```env
NEXT_PUBLIC_API_BASE_URL="http://localhost:8000/api"
NEXT_PUBLIC_BETTER_AUTH_URL="http://localhost:3000"
```

## Frontend Implementation

### 1. Install Required Dependencies

In the frontend directory:
```bash
npm install next@latest react@latest react-dom@latest
npm install @types/node @types/react @types/react-dom
npm install better-auth @better-auth/react
npm install react-query @tanstack/react-query
npm install tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### 2. Initialize Tailwind CSS

Update `tailwind.config.js`:

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

Update `globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 3. Create Authentication Components

Create `frontend/components/auth/auth-provider.tsx`:

```tsx
'use client';

import { AuthProvider as BetterAuthProvider } from "better-auth/react";
import { authClient } from "@/lib/auth/auth-client";

export function AuthProvider({ children }: { children: React.ReactNode }) {
    return (
        <BetterAuthProvider client={authClient}>
            {children}
        </BetterAuthProvider>
    );
}
```

Create `frontend/lib/auth/auth-client.ts`:

```typescript
import { createAuthClient } from "better-auth/client";
import { queryClient } from "@tanstack/react-query";

export const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000",
    queryClient,
});
```

### 4. Create API Client

Create `frontend/lib/api/api-client.ts`:

```typescript
class ApiClient {
  private baseUrl: string;
  private token: string | null;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";
    this.token = null;
  }

  setToken(token: string) {
    this.token = token;
  }

  clearToken() {
    this.token = null;
  }

  async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`;

    const headers = {
      'Content-Type': 'application/json',
      ...(this.token && { 'Authorization': `Bearer ${this.token}` }),
      ...options.headers
    };

    const response = await fetch(url, {
      ...options,
      headers
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'API request failed');
    }

    return response.json();
  }

  // Authentication methods
  async login(credentials: { email: string; password: string }) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
  }

  async register(userData: { email: string; password: string; name: string }) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  }

  async getTasks() {
    return this.request('/tasks');
  }

  async createTask(taskData: { title: string; description?: string; completed: boolean }) {
    return this.request('/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData)
    });
  }

  async updateTask(id: number, taskData: Partial<{ title: string; description?: string; completed: boolean }>) {
    return this.request(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(taskData)
    });
  }

  async deleteTask(id: number) {
    return this.request(`/tasks/${id}`, {
      method: 'DELETE'
    });
  }

  async toggleTaskCompletion(id: number, completed: boolean) {
    return this.request(`/tasks/${id}/complete`, {
      method: 'PATCH',
      body: JSON.stringify({ completed })
    });
  }
}

export const apiClient = new ApiClient();
```

### 5. Create Task Components

Create `frontend/components/tasks/task-list.tsx`:

```tsx
'use client';

import { useQuery, useQueryClient, useMutation } from 'react-query';
import { apiClient } from '@/lib/api/api-client';
import { TaskCard } from './task-card';
import { TaskForm } from './task-form';
import { useState } from 'react';

interface Task {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export function TaskList() {
  const queryClient = useQueryClient();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const { data: tasks, isLoading, error } = useQuery<Task[], Error>(
    'tasks',
    () => apiClient.getTasks().then(res => res.data.tasks),
    {
      refetchOnWindowFocus: false,
    }
  );

  const createMutation = useMutation(
    (taskData: { title: string; description?: string; completed: boolean }) =>
      apiClient.createTask(taskData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('tasks');
        setShowCreateForm(false);
      },
    }
  );

  const updateMutation = useMutation(
    ({ id, data }: { id: number; data: Partial<Task> }) =>
      apiClient.updateTask(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('tasks');
        setEditingTask(null);
      },
    }
  );

  const deleteMutation = useMutation(
    (id: number) => apiClient.deleteTask(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('tasks');
      },
    }
  );

  const toggleCompletionMutation = useMutation(
    ({ id, completed }: { id: number; completed: boolean }) =>
      apiClient.toggleTaskCompletion(id, completed),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('tasks');
      },
    }
  );

  if (isLoading) return <div className="text-center py-10">Loading tasks...</div>;
  if (error) return <div className="text-center py-10 text-red-500">Error: {error.message}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Tasks</h1>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
        >
          {showCreateForm ? 'Cancel' : 'Add Task'}
        </button>
      </div>

      {showCreateForm && (
        <div className="mb-8">
          <TaskForm
            onSubmit={(taskData) => createMutation.mutate(taskData)}
            onCancel={() => setShowCreateForm(false)}
            isLoading={createMutation.isLoading}
          />
        </div>
      )}

      {editingTask && (
        <div className="mb-8">
          <TaskForm
            task={editingTask}
            onSubmit={(taskData) => updateMutation.mutate({ id: editingTask.id, data: taskData })}
            onCancel={() => setEditingTask(null)}
            isLoading={updateMutation.isLoading}
          />
        </div>
      )}

      {tasks && tasks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={() => setEditingTask(task)}
              onDelete={() => deleteMutation.mutate(task.id)}
              onToggleCompletion={() => toggleCompletionMutation.mutate({
                id: task.id,
                completed: !task.completed
              })}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-lg text-gray-500">No tasks yet. Create your first task!</p>
        </div>
      )}
    </div>
  );
}
```

### 6. Create Layout and Route Protection

Update `frontend/app/layout.tsx`:

```tsx
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/components/auth/auth-provider';

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
      <body className={inter.className}>
        <AuthProvider>
          <div className="min-h-screen bg-gray-50">
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
```

### 7. Create Authentication Pages

Create `frontend/app/(auth)/layout.tsx`:

```tsx
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        {children}
      </div>
    </div>
  );
}
```

Create `frontend/app/(auth)/sign-up/page.tsx`:

```tsx
'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
    const [error, setError] = useState("");
    const router = useRouter();
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async (data: any) => {
        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: data.email,
                    password: data.password,
                    name: data.name
                })
            });

            if (response.ok) {
                router.push('/auth/sign-in');
            } else {
                const result = await response.json();
                setError(result.message || 'Registration failed');
            }
        } catch (err) {
            setError('An error occurred during registration');
        }
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Create Account</CardTitle>
                <CardDescription>Sign up for a new account</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
                <CardContent className="space-y-4">
                    {error && <div className="text-red-500 text-sm">{error}</div>}

                    <div>
                        <Input
                            {...register("name", { required: "Name is required" })}
                            placeholder="Full Name"
                        />
                        {errors.name && <span className="text-red-500 text-sm">{errors.name.message}</span>}
                    </div>

                    <div>
                        <Input
                            {...register("email", {
                                required: "Email is required",
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: "Invalid email address"
                                }
                            })}
                            type="email"
                            placeholder="Email"
                        />
                        {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
                    </div>

                    <div>
                        <Input
                            {...register("password", {
                                required: "Password is required",
                                minLength: {
                                    value: 8,
                                    message: "Password must be at least 8 characters"
                                }
                            })}
                            type="password"
                            placeholder="Password"
                        />
                        {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-2">
                    <Button type="submit" className="w-full">Sign Up</Button>
                    <p className="text-sm text-gray-500">
                        Already have an account?{' '}
                        <a href="/auth/sign-in" className="text-blue-500 hover:underline">Sign in</a>
                    </p>
                </CardFooter>
            </form>
        </Card>
    );
}
```

## Running the Application

### 1. Start the Backend Server (if not already running)
```bash
cd ../backend
python -m uvicorn src.main:app --reload --port 8000
```

### 2. Start the Frontend Server
In a new terminal:
```bash
cd frontend
npm run dev
```

### 3. Access the Application
- Frontend: http://localhost:3000
- Sign Up: http://localhost:3000/auth/sign-up
- Sign In: http://localhost:3000/auth/sign-in

## Testing the Frontend

### 1. Authentication Flow
- Navigate to http://localhost:3000/auth/sign-up
- Fill in the registration form
- Verify account creation and redirect to sign-in

### 2. Task Management
- Sign in to access the dashboard
- Create a new task using the "Add Task" button
- Update and delete tasks
- Toggle task completion status

## Configuration Options

### API Client Settings
Adjust API base URL in `.env.local`:
- `NEXT_PUBLIC_API_BASE_URL`: Backend API URL
- `NEXT_PUBLIC_BETTER_AUTH_URL`: Authentication service URL

### Styling
Customize Tailwind CSS in `tailwind.config.js`:
- Colors, spacing, typography
- Breakpoints for responsive design
- Custom components and utilities

## Troubleshooting

### Common Issues

1. **Environment Variables Not Loading**
   - Ensure `.env.local` file is in the correct directory
   - Restart the server after changing environment variables

2. **API Connection Issues**
   - Verify backend server is running
   - Check API URL configuration in environment variables
   - Confirm CORS settings if connecting to remote backend

3. **Authentication Problems**
   - Ensure JWT secret is properly configured in backend
   - Check that authentication endpoints are accessible
   - Verify token storage and retrieval

### Debugging Tips

- Use browser developer tools to inspect network requests and responses
- Check server logs for authentication-related errors
- Verify that API endpoints return expected response formats
- Use React Query devtools to inspect cache state