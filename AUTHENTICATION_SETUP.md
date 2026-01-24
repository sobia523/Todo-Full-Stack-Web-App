# Authentication Setup Guide

This document explains how to set up and use the authentication system in the Todo Full-Stack Web Application.

## Environment Variables

Create a `.env` file in the backend directory with the following variables:

```env
BETTER_AUTH_SECRET="your-super-secret-jwt-key-here-make-it-long-and-random"
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7
DATABASE_URL="postgresql://username:password@localhost:5432/todo_db"
NEON_DATABASE_URL="your-neon-database-url-here"
```

## Frontend Dependencies

Install the required frontend dependencies:

```bash
cd frontend
npm install better-auth @better-auth/react react-query
```

## Backend Dependencies

Install the required backend dependencies:

```bash
cd backend
pip install python-jose[dotenv] passlib[bcrypt] python-multipart
```

## Authentication Endpoints

The authentication system provides the following API endpoints:

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and receive JWT token
- `POST /api/auth/logout` - Logout and revoke token
- `GET /api/auth/me` - Get current user information

## API Usage

All protected endpoints require a valid JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## User Registration

To register a new user, send a POST request to `/api/auth/register` with the following JSON payload:

```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "name": "John Doe"
}
```

## User Login

To login, send a POST request to `/api/auth/login` with the following JSON payload:

```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

On successful login, you will receive a JWT token that can be used to access protected endpoints.