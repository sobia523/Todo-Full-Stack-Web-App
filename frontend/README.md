# Todo App Frontend

This is the frontend for the Todo Full-Stack Web Application, built with Next.js 16+ using the App Router architecture.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env.local` file in the frontend directory with the following content:
   ```
   NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1
   NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will be available at http://localhost:3000.

## Features

- **Authentication**: Built with Better Auth for secure user management
- **Task Management**: Full CRUD operations for tasks
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **State Management**: Using React Query for server state and React hooks for local state
- **Type Safety**: Full TypeScript support with strict typing
- **Security**: JWT-based authentication and secure API communication

## Project Structure

- `app/` - Next.js App Router pages and layouts
- `components/` - Reusable React components
- `lib/` - Shared libraries (auth, API client)
- `hooks/` - Custom React hooks
- `types/` - TypeScript type definitions
- `contexts/` - React Context providers
- `providers/` - React providers
- `utils/` - Utility functions
- `docs/` - Documentation files
- `__tests__/` - Unit and integration tests

## Environment Variables

- `NEXT_PUBLIC_API_BASE_URL`: Base URL for the backend API
- `NEXT_PUBLIC_BETTER_AUTH_URL`: Base URL for the Better Auth service