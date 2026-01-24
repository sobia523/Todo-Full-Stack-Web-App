# Quickstart Guide: Authentication & JWT Security for Todo Full-Stack Web Application

**Feature**: 002-auth-jwt-security | **Date**: 2026-01-17 | **Plan**: [link to plan.md](./plan.md)

## Overview

This quickstart guide provides step-by-step instructions for implementing authentication and JWT security in the Todo Full-Stack Web Application using Better Auth and FastAPI. Follow these steps to get a working authentication system in under 30 minutes.

## Prerequisites

- Node.js 18+ and npm/yarn for frontend
- Python 3.11+ for backend
- Neon Serverless PostgreSQL database
- Git for version control
- Basic knowledge of Next.js and FastAPI

## Environment Setup

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd Todo-Full-Stack-App
```

### 2. Set Up Backend Environment
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 3. Set Up Frontend Environment
```bash
cd frontend
npm install
```

### 4. Configure Environment Variables

Create a `.env` file in the backend directory:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/todo_db"
BETTER_AUTH_SECRET="your-super-secret-jwt-key-here-make-it-long-and-random"
BETTER_AUTH_URL="http://localhost:3000"
NEON_DATABASE_URL="your-neon-database-url-here"
```

## Backend Implementation

### 1. Install Required Dependencies

In the backend directory:
```bash
pip install better-fastapi python-jose[dotenv] passlib[bcrypt] python-multipart
```

### 2. Create Authentication Models

Create `backend/src/auth/models.py`:

```python
from sqlmodel import SQLModel, Field
from typing import Optional
import uuid
from datetime import datetime
from pydantic import BaseModel, EmailStr

class UserBase(SQLModel):
    email: EmailStr = Field(unique=True, index=True)
    name: str

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: uuid.UUID
    is_active: bool
    created_at: datetime

class User(UserBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    password_hash: str
    is_active: bool = Field(default=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    last_login_at: Optional[datetime] = None

class Token(BaseModel):
    access_token: str
    token_type: str
    expires_in: int

class TokenData(BaseModel):
    user_id: uuid.UUID
    email: str
```

### 3. Create Authentication Utilities

Create `backend/src/auth/utils.py`:

```python
from datetime import datetime, timedelta
from typing import Optional
import jwt
from passlib.context import CryptContext
from fastapi import HTTPException, status
from config import settings
from .models import TokenData

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=30)

    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.better_auth_secret, algorithm="HS256")
    return encoded_jwt

def verify_token(token: str) -> Optional[TokenData]:
    try:
        payload = jwt.decode(token, settings.better_auth_secret, algorithms=["HS256"])
        user_id: str = payload.get("sub")
        email: str = payload.get("user_email")

        if user_id is None or email is None:
            return None

        token_data = TokenData(user_id=user_id, email=email)
        return token_data
    except jwt.JWTError:
        return None
```

### 4. Create Authentication Middleware

Create `backend/src/auth/middleware.py`:

```python
from fastapi import HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from typing import Optional
from ..database import get_session
from .utils import verify_token
from .models import User

security = HTTPBearer()

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    session: Session = Depends(get_session)
) -> User:
    token = credentials.credentials

    token_data = verify_token(token)
    if token_data is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user = session.get(User, token_data.user_id)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Inactive user",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return user
```

### 5. Create Authentication Routes

Create `backend/src/api/routes/auth.py`:

```python
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import timedelta
from ..deps import get_session
from ...auth.models import UserCreate, UserResponse, Token
from ...auth.utils import verify_password, get_password_hash, create_access_token
from ...auth.models import User
from ...config import settings

router = APIRouter(prefix="/auth", tags=["authentication"])

@router.post("/register", response_model=UserResponse, status_code=201)
async def register(user: UserCreate, session: Session = Depends(get_session)):
    # Check if user already exists
    existing_user = session.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered"
        )

    # Create new user
    db_user = User(
        email=user.email,
        name=user.name,
        password_hash=get_password_hash(user.password)
    )

    session.add(db_user)
    session.commit()
    session.refresh(db_user)

    return db_user

@router.post("/login", response_model=Token)
async def login(email: str, password: str, session: Session = Depends(get_session)):
    user = session.query(User).filter(User.email == email).first()

    if not user or not verify_password(password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Update last login time
    user.last_login_at = datetime.utcnow()
    session.add(user)
    session.commit()

    access_token_expires = timedelta(minutes=settings.access_token_expire_minutes)
    access_token = create_access_token(
        data={"sub": str(user.id), "user_email": user.email, "user_name": user.name},
        expires_delta=access_token_expires
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "expires_in": access_token_expires.seconds
    }

@router.get("/me", response_model=UserResponse)
async def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user
```

### 6. Update Main Application

Update `backend/src/main.py` to include auth routes:

```python
from fastapi import FastAPI
from .api.routes import auth, tasks
from .database import engine, create_db_and_tables

app = FastAPI(title="Todo API with JWT Auth")

@app.on_event("startup")
def startup():
    create_db_and_tables()

app.include_router(auth.router)
app.include_router(tasks.router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

## Frontend Implementation

### 1. Install Better Auth Dependencies

In the frontend directory:
```bash
npm install better-auth @better-auth/react react-query
```

### 2. Configure Better Auth Client

Create `frontend/lib/auth/auth-client.ts`:

```typescript
import { createAuthClient } from "better-auth/client";
import { queryClient } from "@tanstack/react-query";

export const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000",
    queryClient,
});
```

### 3. Create Auth Provider Component

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

### 4. Create Sign Up Page

Create `frontend/app/auth/sign-up/page.tsx`:

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
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Card className="w-full max-w-md">
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
        </div>
    );
}
```

### 5. Create Sign In Page

Create `frontend/app/auth/sign-in/page.tsx`:

```tsx
'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignInPage() {
    const [error, setError] = useState("");
    const router = useRouter();
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async (data: any) => {
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: data.email,
                    password: data.password
                })
            });

            if (response.ok) {
                const result = await response.json();

                // Store the token in localStorage or a secure cookie
                localStorage.setItem('access_token', result.access_token);

                // Redirect to dashboard or home
                router.push('/');
            } else {
                const result = await response.json();
                setError(result.detail || 'Login failed');
            }
        } catch (err) {
            setError('An error occurred during login');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Sign In</CardTitle>
                    <CardDescription>Log in to your account</CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <CardContent className="space-y-4">
                        {error && <div className="text-red-500 text-sm">{error}</div>}

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
                                    required: "Password is required"
                                })}
                                type="password"
                                placeholder="Password"
                            />
                            {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-2">
                        <Button type="submit" className="w-full">Sign In</Button>
                        <p className="text-sm text-gray-500">
                            Don't have an account?{' '}
                            <a href="/auth/sign-up" className="text-blue-500 hover:underline">Sign up</a>
                        </p>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
```

### 6. Update Root Layout to Include Auth Provider

Update `frontend/app/layout.tsx`:

```tsx
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/components/auth/auth-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Todo App with Authentication',
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
          <div className="container mx-auto">
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
```

## Running the Application

### 1. Start the Backend Server

```bash
cd backend
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
- API Documentation: http://localhost:8000/docs
- Sign Up: http://localhost:3000/auth/sign-up
- Sign In: http://localhost:3000/auth/sign-in

## Testing Authentication

### 1. Register a New User
- Navigate to http://localhost:3000/auth/sign-up
- Fill in the registration form
- Submit to create a new account

### 2. Log In
- Navigate to http://localhost:3000/auth/sign-in
- Use the credentials from registration
- You should be redirected to the home page

### 3. Test API Endpoints
- Use the JWT token from login to access protected endpoints
- Example cURL command:
```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     http://localhost:8000/api/v1/tasks
```

## Configuration Options

### JWT Token Settings
Adjust token expiration and other settings in `backend/src/config.py`:

```python
ACCESS_TOKEN_EXPIRE_MINUTES = 30  # Token expires in 30 minutes
REFRESH_TOKEN_EXPIRE_DAYS = 7     # Refresh token expires in 7 days
```

### Database Settings
Update database connection in `.env` file:
- `DATABASE_URL` for your PostgreSQL connection
- `NEON_DATABASE_URL` for Neon Serverless PostgreSQL

## Troubleshooting

### Common Issues

1. **Environment Variables Not Loading**
   - Ensure `.env` file is in the correct directory
   - Restart the server after changing environment variables

2. **Database Connection Issues**
   - Verify database URL is correct
   - Ensure database server is running
   - Check firewall settings if connecting to remote database

3. **JWT Secret Issues**
   - Ensure `BETTER_AUTH_SECRET` is set and sufficiently long/random
   - Verify same secret is used for signing and verification

4. **CORS Issues**
   - Check that frontend and backend origins are properly configured
   - Ensure CORS middleware is correctly set up in FastAPI

### Debugging Tips

- Enable debug logging in the backend to see detailed request information
- Use browser developer tools to inspect network requests and responses
- Check server logs for authentication-related errors
- Verify JWT token format and contents using online JWT decoders

## Next Steps

1. Implement refresh token functionality for longer user sessions
2. Add email verification for new registrations
3. Implement password reset functionality
4. Add role-based access control for advanced permissions
5. Implement rate limiting for authentication endpoints
6. Add social login options using Better Auth providers