# Frontend API Integration Guide

This document describes how the frontend integrates with the backend API in the Todo Full-Stack Web Application.

## Overview

The frontend communicates with the backend API using a centralized API client that handles all HTTP requests and responses. The integration includes authentication, task management, and error handling.

## API Client

The `ApiClient` class in `lib/api/api-client.ts` serves as the central hub for all API communications:

```typescript
import { apiClient } from '@/lib/api/api-client';

// Example usage
const tasks = await apiClient.getTasks();
```

## Authentication Integration

Authentication is handled through Better Auth, which manages JWT tokens automatically:

- Login: `apiClient.login(credentials)`
- Registration: `apiClient.register(userData)`
- Logout: `apiClient.logout()`
- Current user: `apiClient.getCurrentUser()`

The API client automatically attaches JWT tokens to authenticated requests.

## Task Management Endpoints

- Get all tasks: `apiClient.getTasks()`
- Get specific task: `apiClient.getTask(id)`
- Create task: `apiClient.createTask(taskData)`
- Update task: `apiClient.updateTask(id, taskData)`
- Delete task: `apiClient.deleteTask(id)`
- Toggle task completion: `apiClient.toggleTaskCompletion(id, completed)`

## React Query Integration

React Query hooks are provided for easy data fetching and mutations:

```typescript
// Hooks in hooks/task-hooks.ts
const { data: tasks, isLoading, error } = useTasks();
const createTaskMutation = useCreateTask();
```

## Error Handling

Errors are handled consistently throughout the application:
- Network errors trigger appropriate UI feedback
- Unauthorized requests redirect to login
- Validation errors are displayed in forms

## Environment Configuration

The API base URL is configured in `.env.local`:

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000
```

## Security Features

- JWT tokens are automatically attached to requests
- Secure token storage via Better Auth
- Protected routes using the `ProtectedRoute` component
- Input sanitization through React rendering