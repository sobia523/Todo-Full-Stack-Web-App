# API Contracts: Frontend Web Application for Todo Full-Stack Web Application

**Feature**: 004-frontend-web-app | **Date**: 2026-01-17 | **Plan**: [link to plan.md](../plan.md)

## Overview

This document defines the API contracts that the frontend web application will consume from the backend API. It specifies the endpoints, request/response formats, authentication requirements, and error handling patterns that the frontend will use to interact with the backend services.

## Base URL and Versioning

- **Base URL**: `https://api.yourapp.com/api/v1` (to be configured in environment variables)
- **Version**: v1 (to be included in all API requests)
- **Protocol**: HTTPS required for all API requests
- **Content-Type**: `application/json` for all requests and responses

## Authentication Flow

### 1. User Registration

**Endpoint**: `POST /auth/register`

**Description**: Creates a new user account with provided credentials.

**Request Headers**:
```
Content-Type: application/json
```

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "name": "John Doe"
}
```

**Request Validation**:
- Email must be valid format
- Password must meet strength requirements (min 8 chars, mixed case, numbers, symbols)
- Name must not exceed 100 characters
- Email must not already exist

**Success Response** (201 Created):
```json
{
  "success": true,
  "message": "Account created successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "name": "John Doe",
    "created_at": "2026-01-17T10:30:00Z"
  }
}
```

**Error Responses**:
- `400 Bad Request`: Invalid input data
- `409 Conflict`: Email already exists
- `422 Unprocessable Entity`: Validation errors

### 2. User Login

**Endpoint**: `POST /auth/login`

**Description**: Authenticates user credentials and returns JWT access token.

**Request Headers**:
```
Content-Type: application/json
```

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Success Response** (200 OK):
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "bearer",
    "expires_in": 1800,
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "user@example.com",
      "name": "John Doe"
    }
  }
}
```

**Error Responses**:
- `400 Bad Request`: Missing email or password
- `401 Unauthorized`: Invalid credentials
- `429 Too Many Requests`: Rate limit exceeded

### 3. Get Current User

**Endpoint**: `GET /auth/me`

**Description**: Returns information about the currently authenticated user.

**Request Headers**:
```
Authorization: Bearer <access_token>
```

**Success Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "name": "John Doe",
    "is_active": true,
    "created_at": "2026-01-17T10:30:00Z"
  }
}
```

**Error Responses**:
- `401 Unauthorized`: Invalid or missing token

## Task Management Endpoints

### 4. Get User Tasks

**Endpoint**: `GET /tasks`

**Description**: Returns all tasks belonging to the authenticated user.

**Request Headers**:
```
Authorization: Bearer <access_token>
```

**Query Parameters**:
- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Number of items per page (default: 10, max: 100)
- `completed` (optional): Filter by completion status (true/false)

**Success Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "tasks": [
      {
        "id": 1,
        "title": "Complete project",
        "description": "Finish the frontend implementation",
        "completed": false,
        "user_id": "550e8400-e29b-41d4-a716-446655440000",
        "created_at": "2026-01-17T10:30:00Z",
        "updated_at": "2026-01-17T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 1,
      "has_next": false,
      "has_prev": false
    }
  }
}
```

**Error Responses**:
- `401 Unauthorized`: Invalid or missing token

### 5. Create Task

**Endpoint**: `POST /tasks`

**Description**: Creates a new task for the authenticated user.

**Request Headers**:
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body**:
```json
{
  "title": "New Task",
  "description": "Task description (optional)",
  "completed": false
}
```

**Success Response** (201 Created):
```json
{
  "success": true,
  "message": "Task created successfully",
  "data": {
    "id": 2,
    "title": "New Task",
    "description": "Task description (optional)",
    "completed": false,
    "user_id": "550e8400-e29b-41d4-a716-446655440000",
    "created_at": "2026-01-17T10:45:00Z",
    "updated_at": "2026-01-17T10:45:00Z"
  }
}
```

**Error Responses**:
- `401 Unauthorized`: Invalid or missing token
- `400 Bad Request`: Invalid input data

### 6. Update Task

**Endpoint**: `PUT /tasks/{task_id}`

**Description**: Updates an existing task owned by the authenticated user.

**Path Parameters**:
- `task_id`: ID of the task to update

**Request Headers**:
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body**:
```json
{
  "title": "Updated Task Title",
  "description": "Updated description",
  "completed": true
}
```

**Success Response** (200 OK):
```json
{
  "success": true,
  "message": "Task updated successfully",
  "data": {
    "id": 2,
    "title": "Updated Task Title",
    "description": "Updated description",
    "completed": true,
    "user_id": "550e8400-e29b-41d4-a716-446655440000",
    "created_at": "2026-01-17T10:45:00Z",
    "updated_at": "2026-01-17T11:00:00Z"
  }
}
```

**Error Responses**:
- `401 Unauthorized`: Invalid or missing token
- `403 Forbidden`: User does not own the task
- `404 Not Found`: Task does not exist

### 7. Toggle Task Completion

**Endpoint**: `PATCH /tasks/{task_id}/complete`

**Description**: Toggles the completion status of a task owned by the authenticated user.

**Path Parameters**:
- `task_id`: ID of the task to update

**Request Headers**:
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body**:
```json
{
  "completed": true
}
```

**Success Response** (200 OK):
```json
{
  "success": true,
  "message": "Task completion updated successfully",
  "data": {
    "id": 2,
    "title": "Updated Task Title",
    "description": "Updated description",
    "completed": true,
    "user_id": "550e8400-e29b-41d4-a716-446655440000",
    "created_at": "2026-01-17T10:45:00Z",
    "updated_at": "2026-01-17T11:05:00Z"
  }
}
```

**Error Responses**:
- `401 Unauthorized`: Invalid or missing token
- `403 Forbidden`: User does not own the task
- `404 Not Found`: Task does not exist

### 8. Delete Task

**Endpoint**: `DELETE /tasks/{task_id}`

**Description**: Deletes a task owned by the authenticated user.

**Path Parameters**:
- `task_id`: ID of the task to delete

**Request Headers**:
```
Authorization: Bearer <access_token>
```

**Success Response** (200 OK):
```json
{
  "success": true,
  "message": "Task deleted successfully"
}
```

**Error Responses**:
- `401 Unauthorized`: Invalid or missing token
- `403 Forbidden`: User does not own the task
- `404 Not Found`: Task does not exist

## Authentication Header Format

All protected endpoints require the following header format:

```
Authorization: Bearer <jwt_token>
```

Where `<jwt_token>` is the JWT access token received during login.

## Error Response Format

All error responses follow this standard format:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {
      // Optional: Additional error details
    }
  }
}
```

Common error codes:
- `INVALID_CREDENTIALS`: Login credentials are incorrect
- `TOKEN_EXPIRED`: JWT token has expired
- `TOKEN_INVALID`: JWT token is malformed or invalid
- `INSUFFICIENT_PERMISSIONS`: User lacks required permissions
- `VALIDATION_ERROR`: Request data validation failed
- `RESOURCE_NOT_FOUND`: Requested resource does not exist
- `RATE_LIMIT_EXCEEDED`: Too many requests from the same client

## Frontend API Client Implementation

The frontend should implement a centralized API client that:

1. Attaches the JWT token to all authenticated requests
2. Handles common error scenarios
3. Implements retry logic for failed requests
4. Provides loading states for user feedback
5. Caches responses where appropriate
6. Validates responses before processing

Example implementation pattern:

```typescript
class ApiClient {
  private baseUrl: string;
  private token: string | null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.token = null;
  }

  setToken(token: string) {
    this.token = token;
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

  // Specific methods for each endpoint
  async login(credentials: LoginCredentials) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
  }

  // ... other specific methods
}
```

## Validation and Compliance

### Frontend Validation
- All API responses should be validated against expected schema
- Error handling should provide user-friendly messages
- Loading states should be properly managed
- Network error scenarios should be handled gracefully

### Security Requirements
- JWT tokens must be stored securely
- API requests must use HTTPS
- Sensitive data should be sanitized before display
- Input validation should occur before API requests