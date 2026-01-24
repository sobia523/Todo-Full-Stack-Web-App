# Data Model: Frontend Web Application for Todo Full-Stack Web Application

**Feature**: 004-frontend-web-app | **Date**: 2026-01-17 | **Plan**: [link to plan.md](./plan.md)

## Overview

This document defines the data models required for the frontend web application. The models represent the data structures that will be consumed from the backend API and managed in the frontend application state.

## Entity Definitions

### User Session Entity
The User Session entity represents the authenticated user state in the frontend application.

**Attributes:**
- `id`: string - User's unique identifier from the backend
- `email`: string - User's email address
- `name`: string - User's display name
- `isLoggedIn`: boolean - Whether the user is currently authenticated
- `token`: string - JWT token for API authentication
- `tokenExpiry`: Date - Expiration time of the JWT token

**Constraints:**
- Session data must be kept synchronized with backend authentication state
- Token must be securely stored and transmitted
- Session must be cleared on logout or token expiration

### Task Entity
The Task entity represents a user's task item as consumed from the backend API.

**Attributes:**
- `id`: number - Unique identifier for the task
- `title`: string - Task title (required, max 255 characters)
- `description`: string (optional) - Task description
- `completed`: boolean - Whether the task is completed
- `userId`: string - ID of the user who owns the task
- `createdAt`: Date - Task creation timestamp
- `updatedAt`: Date - Last task update timestamp

**Constraints:**
- Title is required and must not exceed 255 characters
- Only the owning user can modify the task
- Completed status can be toggled by the owner
- Tasks are read-only for non-owning users (not applicable in single-user context)

### UI State Entity
The UI State entity represents the current state of the user interface components.

**Attributes:**
- `isLoading`: boolean - Whether data is being loaded
- `isSubmitting`: boolean - Whether a form is being submitted
- `error`: string (optional) - Error message if any
- `successMessage`: string (optional) - Success message if any
- `currentView`: string - Current UI view (list, create, edit, etc.)

**Constraints:**
- Loading states must be properly communicated to users
- Error messages must be user-friendly
- Success messages should be temporary
- UI state should be isolated to relevant components

## Data Flow Patterns

### Authentication Data Flow
```
1. User enters credentials in login form
2. Credentials sent to authentication API
3. Backend validates credentials and returns JWT
4. JWT stored in secure client-side storage
5. JWT attached to all subsequent API requests
6. Session state updated in frontend
```

### Task Data Flow
```
1. Authenticated user requests task list
2. Frontend sends request with JWT to backend
3. Backend validates JWT and retrieves user's tasks
4. Task list returned to frontend
5. Frontend caches data and updates UI
6. User can create/update/delete tasks
7. Changes synced to backend via API
```

## State Management Structure

### Global State Structure
```typescript
interface AppState {
  auth: {
    user: UserSession | null;
    isLoading: boolean;
    error: string | null;
  };
  tasks: {
    items: Task[];
    loading: boolean;
    error: string | null;
    currentView: 'list' | 'create' | 'edit';
  };
  ui: {
    isLoading: boolean;
    error: string | null;
    successMessage: string | null;
  };
}
```

### API Response Structures
```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

interface TaskListResponse {
  tasks: Task[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

interface TaskResponse {
  task: Task;
}
```

## Validation Rules

### Input Validation
- Email format validation for authentication
- Password strength requirements (min 8 chars, mixed case, numbers, symbols)
- Task title validation (required, max 255 characters)
- Task description validation (max 1000 characters)

### State Validation
- Prevent actions when not authenticated
- Validate form inputs before submission
- Check for network connectivity before API calls
- Validate response data before updating state

## Performance Considerations

### Caching Strategy
- Cache user session data in memory
- Cache task lists with React Query for offline availability
- Invalidate cache on mutations
- Implement stale-while-revalidate pattern

### Loading States
- Show skeleton screens during initial load
- Display progress indicators for form submissions
- Provide immediate feedback for user interactions
- Handle optimistic updates where appropriate

## Security Considerations

### Data Protection
- JWT tokens stored securely (preferably in memory)
- Sensitive data not persisted in localStorage without encryption
- Proper validation of all API responses
- Sanitization of data before rendering

### Access Control
- Verify authentication before allowing actions
- Validate task ownership before modifications
- Proper error handling for unauthorized access
- Secure transmission of data via HTTPS

## API Contract Alignment

The frontend data models align with the backend API contracts:

- Task entity matches backend Task model
- Authentication flow follows JWT token pattern
- API response structures match backend responses
- Error handling patterns are consistent