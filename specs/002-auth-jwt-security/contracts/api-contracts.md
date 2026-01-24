# API Contracts: Authentication & JWT Security for Todo Full-Stack Web Application

**Feature**: 002-auth-jwt-security | **Date**: 2026-01-17 | **Plan**: [link to plan.md](./plan.md)

## Overview

This document defines the API contracts for authentication and JWT security in the Todo Full-Stack Web Application. It specifies the endpoints, request/response formats, authentication requirements, and error handling patterns for secure user authentication and API access control.

## Base URL and Versioning

- **Base URL**: `https://api.yourapp.com/api/v1`
- **Version**: v1 (to be included in all authentication endpoints)
- **Protocol**: HTTPS required for all authentication endpoints
- **Content-Type**: `application/json` for all requests and responses

## Authentication Flow Overview

1. User registers via POST `/auth/register`
2. User logs in via POST `/auth/login` to receive JWT token
3. JWT token is included in Authorization header for protected endpoints
4. Token is validated on each request to protected endpoints
5. Token can be refreshed via POST `/auth/refresh` before expiration

## Authentication Endpoints

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
    "user_id": "550e8400-e29b-41d4-a716-446655440000",
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
      "user_id": "550e8400-e29b-41d4-a716-446655440000",
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

### 3. Token Refresh

**Endpoint**: `POST /auth/refresh`

**Description**: Refreshes an expiring JWT access token using a refresh token.

**Request Headers**:
```
Authorization: Bearer <refresh_token>
Content-Type: application/json
```

**Request Body**:
```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Success Response** (200 OK):
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "bearer",
    "expires_in": 1800
  }
}
```

**Error Responses**:
- `401 Unauthorized`: Invalid or expired refresh token
- `400 Bad Request`: Missing refresh token

### 4. User Logout

**Endpoint**: `POST /auth/logout`

**Description**: Invalidates the current JWT token and performs logout.

**Request Headers**:
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body**:
```json
{}
```

**Success Response** (200 OK):
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

**Error Responses**:
- `401 Unauthorized`: Invalid token

### 5. Get Current User

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
    "user_id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "name": "John Doe",
    "is_active": true,
    "created_at": "2026-01-17T10:30:00Z"
  }
}
```

**Error Responses**:
- `401 Unauthorized`: Invalid or missing token

## Protected Task Endpoints

### 6. Get User Tasks

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
        "id": "550e8400-e29b-41d4-a716-446655440001",
        "title": "Complete project",
        "description": "Finish the authentication implementation",
        "completed": false,
        "created_at": "2026-01-17T10:30:00Z",
        "updated_at": "2026-01-17T10:30:00Z",
        "user_id": "550e8400-e29b-41d4-a716-446655440000"
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

### 7. Create Task

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
    "id": "550e8400-e29b-41d4-a716-446655440002",
    "title": "New Task",
    "description": "Task description (optional)",
    "completed": false,
    "created_at": "2026-01-17T10:45:00Z",
    "updated_at": "2026-01-17T10:45:00Z",
    "user_id": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

**Error Responses**:
- `401 Unauthorized`: Invalid or missing token
- `400 Bad Request`: Invalid input data

### 8. Update Task

**Endpoint**: `PUT /tasks/{task_id}`

**Description**: Updates an existing task owned by the authenticated user.

**Path Parameters**:
- `task_id`: UUID of the task to update

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
    "id": "550e8400-e29b-41d4-a716-446655440002",
    "title": "Updated Task Title",
    "description": "Updated description",
    "completed": true,
    "created_at": "2026-01-17T10:45:00Z",
    "updated_at": "2026-01-17T11:00:00Z",
    "user_id": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

**Error Responses**:
- `401 Unauthorized`: Invalid or missing token
- `403 Forbidden`: User does not own the task
- `404 Not Found`: Task does not exist

### 9. Delete Task

**Endpoint**: `DELETE /tasks/{task_id}`

**Description**: Deletes a task owned by the authenticated user.

**Path Parameters**:
- `task_id`: UUID of the task to delete

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

## JWT Token Structure

The JWT tokens contain the following claims:

- `sub`: Subject (user ID)
- `exp`: Expiration time (Unix timestamp)
- `iat`: Issued at time (Unix timestamp)
- `jti`: JWT ID (for potential revocation tracking)
- `user_email`: User's email address
- `user_name`: User's display name

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

## Security Requirements

### Transport Security
- All authentication endpoints must use HTTPS
- HSTS headers must be set on all responses
- Secure cookies for any session data

### Rate Limiting
- Limit login attempts to prevent brute force attacks
- Implement exponential backoff for failed attempts
- Track failed attempts by IP and/or email

### Token Security
- JWT tokens must be signed with the BETTER_AUTH_SECRET
- Short-lived access tokens (recommended 30 minutes)
- Refresh tokens with longer expiry (recommended 7 days)
- Secure token storage and transmission

## Validation and Compliance

### OpenAPI Specification
These contracts should be represented in OpenAPI 3.0 format for documentation and client generation.

### Testing Requirements
- All endpoints must have automated tests for success and error cases
- Authentication flow tests must verify token validation
- Data isolation tests must confirm users can't access others' data