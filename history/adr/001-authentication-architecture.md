---
adr: 1
title: Authentication Architecture - Better Auth with FastAPI Middleware
date: 2026-01-17
status: Proposed
authors:
  - TLS
reviewers:
  - team
---

# ADR 1: Authentication Architecture - Better Auth with FastAPI Middleware

## Status

Proposed

## Context

The Todo Full-Stack Web Application requires a robust authentication system that supports user registration, login with JWT token issuance, and secure API access with proper token validation and user data isolation. We need to decide on the authentication architecture that balances security, developer experience, and maintainability.

Key constraints include:
- Frontend: Next.js 16+ (App Router) with Better Auth
- Backend: Python FastAPI with JWT token validation
- Security-by-design approach with JWT-based authentication
- Clear separation of concerns between frontend and backend authentication

## Decision

We will implement a hybrid authentication architecture where:
- Frontend uses Better Auth for user interface and token management
- Backend uses FastAPI middleware for token validation and user data isolation
- JWT tokens are issued by Better Auth and validated by backend middleware
- User data isolation is enforced through token validation and user_id filtering

### Components
- Frontend: Better Auth client library with React integration
- Backend: FastAPI authentication middleware with JWT validation
- Token format: Standard JWT with user_id, email, and expiration claims
- Storage: Neon Serverless PostgreSQL with user and task foreign key relationships

## Alternatives Considered

### Alternative 1: Custom Authentication Implementation
- Implement both frontend and backend authentication from scratch
- Pros: Complete control over authentication flow, custom features
- Cons: Significant development time, security risks, maintenance burden

### Alternative 2: Third-party Authentication Only (Auth0, Firebase)
- Use external authentication service for both frontend and backend
- Pros: Minimal implementation effort, enterprise-grade security
- Cons: Vendor lock-in, potential costs, less control over user experience

### Alternative 3: Session-based Authentication
- Use traditional session cookies instead of JWT tokens
- Pros: Server-side session management, easier revocation
- Cons: Less scalable, requires server-side session storage, doesn't align with JWT requirement

## Consequences

### Positive
- Leverages proven authentication libraries (Better Auth) for frontend
- Maintains clear separation of concerns between frontend and backend
- Supports the required JWT-based authentication approach
- Enables proper user data isolation through token validation
- Reduces implementation time compared to custom solution
- Good developer experience with pre-built UI components

### Negative
- Introduces external dependency on Better Auth
- Requires coordination between frontend and backend authentication
- Potential complexity in token synchronization between frontend and backend
- Learning curve for Better Auth integration

## References

- [plan.md](../../specs/002-auth-jwt-security/plan.md)
- [research.md](../../specs/002-auth-jwt-security/research.md)
- [api-contracts.md](../../specs/002-auth-jwt-security/contracts/api-contracts.md)