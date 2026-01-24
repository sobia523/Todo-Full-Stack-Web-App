# Data Model: Authentication & JWT Security for Todo Full-Stack Web Application

**Feature**: 002-auth-jwt-security | **Date**: 2026-01-17 | **Plan**: [link to plan.md](./plan.md)

## Overview

This document defines the data models required for implementing authentication and JWT security in the Todo Full-Stack Web Application. The models include user accounts, authentication tokens, and their relationships to the existing task system.

## Entity Definitions

### User Entity
The User entity represents registered users of the application and serves as the foundation for authentication and authorization.

**Attributes:**
- `id`: UUID (Primary Key) - Unique identifier for the user
- `email`: String (Unique, Indexed) - User's email address for login
- `password_hash`: String - Hashed password using bcrypt or similar
- `name`: String - User's display name
- `is_active`: Boolean (Default: True) - Whether the account is active
- `created_at`: DateTime - Account creation timestamp
- `updated_at`: DateTime - Last account update timestamp
- `last_login_at`: DateTime - Last successful login timestamp

**Constraints:**
- Email must be unique and follow valid email format
- Password must meet minimum strength requirements
- Email and password_hash are required fields

### JWT Token Entity
The JWT Token entity represents active authentication tokens issued to users. While JWTs are typically stateless, we may track certain metadata for security purposes.

**Attributes:**
- `id`: UUID (Primary Key) - Unique identifier for the token record
- `user_id`: UUID (Foreign Key) - References the associated user
- `token_hash`: String - Hash of the JWT token (for revocation tracking)
- `expires_at`: DateTime - Token expiration timestamp
- `created_at`: DateTime - Token issuance timestamp
- `is_revoked`: Boolean (Default: False) - Whether the token has been revoked
- `device_info`: String (Optional) - Information about the device used

**Constraints:**
- Must have a valid relationship to an active user
- Expiration time must be in the future when created
- Revoked tokens cannot be used for authentication

### Task Entity (Updated)
The existing Task entity needs to be updated to include user ownership for proper data isolation.

**Additional Attributes:**
- `user_id`: UUID (Foreign Key) - References the user who owns the task

**Updated Constraints:**
- Tasks can only be accessed by the owning user or admin users
- Foreign key constraint to ensure valid user association

## Relationship Diagram

```
┌─────────┐    ┌──────────────┐    ┌─────────┐
│  User   │    │  JWT Token   │    │  Task   │
├─────────┤    ├──────────────┤    ├─────────┤
│ id (PK) │───▶│ user_id (FK) │    │ id (PK) │
│ email   │    │ id (PK)      │    │ ...     │
│ name    │    │ token_hash   │    │ user_id │──┐
│ ...     │    │ expires_at   │    │ ...     │  │
└─────────┘    │ created_at   │    └─────────┘  │
               │ is_revoked   │                 │
               │ device_info  │                 │
               └──────────────┘                 │
                                                │
                                        ┌───────────────┐
                                        │ Foreign Key   │
                                        │ Constraint    │
                                        └───────────────┘
```

## Database Schema

### SQLModel Definitions

```python
from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List
import uuid
from datetime import datetime
from pydantic import EmailStr

class UserBase(SQLModel):
    email: EmailStr = Field(unique=True, index=True)
    name: str
    is_active: bool = Field(default=True)

class User(UserBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    password_hash: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    last_login_at: Optional[datetime] = None

    # Relationship to owned tasks
    tasks: List["Task"] = Relationship(back_populates="owner")

class JWTTokenBase(SQLModel):
    user_id: uuid.UUID = Field(foreign_key="user.id")
    token_hash: str = Field(index=True)
    expires_at: datetime
    is_revoked: bool = Field(default=False)
    device_info: Optional[str] = None

class JWTToken(JWTTokenBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)

class TaskBase(SQLModel):
    title: str
    description: Optional[str] = None
    completed: bool = Field(default=False)
    user_id: uuid.UUID = Field(foreign_key="user.id")

class Task(TaskBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationship to owner
    owner: User = Relationship(back_populates="tasks")
```

## Indexes and Performance Considerations

### Critical Indexes
- User.email: For fast login lookups
- User.id: For JWT token validation lookups
- JWTToken.token_hash: For token validation
- JWTToken.expires_at: For cleanup queries
- Task.user_id: For user-specific task queries

### Query Optimization
- Queries filtering by authenticated user ID should use indexed columns
- Batch operations for token cleanup to avoid performance issues
- Connection pooling for authentication-heavy operations

## Security Considerations

### Data Protection
- Passwords must be hashed using bcrypt or argon2 with appropriate salt
- JWT token hashes prevent token replay attacks
- Sensitive authentication data encrypted at rest where applicable

### Access Control
- Foreign key constraints enforce referential integrity
- Row-level security ensures users can only access their own data
- Proper validation of user ownership in all API endpoints

## Migration Strategy

### From Current Schema
1. Add `user_id` column to existing `tasks` table
2. Create `users` table with authentication fields
3. Create `jwt_tokens` table for token tracking (optional)
4. Establish foreign key relationships
5. Populate initial admin user if needed

### Backward Compatibility
- Existing tasks without user_id may be assigned to a default user initially
- Gradual migration of existing data to new schema
- Maintain API compatibility during transition

## Validation Rules

### User Creation
- Email format validation
- Password strength requirements (min 8 chars, mixed case, numbers, symbols)
- Duplicate email prevention

### Token Management
- Automatic expiration of tokens
- Maximum concurrent sessions limit
- Device fingerprinting for suspicious activity detection

## Scalability Considerations

### High Availability
- Database replication for authentication data
- Caching layer for frequently accessed user information
- Load balancing for authentication requests

### Growth Projections
- Index maintenance for growing user base
- Token cleanup jobs for expired tokens
- Partitioning strategies for large datasets