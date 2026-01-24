---
adr: 2
title: Technology Stack - Next.js, FastAPI, and Neon PostgreSQL
date: 2026-01-17
status: Proposed
authors:
  - TLS
reviewers:
  - team
---

# ADR 2: Technology Stack - Next.js, FastAPI, and Neon PostgreSQL

## Status

Proposed

## Context

The Todo Full-Stack Web Application requires selection of a technology stack that balances performance, scalability, development velocity, and team expertise. The stack must support the required features including authentication, real-time updates, and multi-user isolation while maintaining good performance under load.

Key constraints include:
- Support for 10k users and 100k authenticated sessions
- <200ms authentication validation requirements
- <100ms p95 for token validation
- Memory usage under 256MB
- Support for 1000 concurrent authenticated users

## Decision

We will use the following technology stack:
- Frontend: Next.js 16+ with App Router for server-side rendering and routing
- Backend: Python FastAPI for high-performance async API development
- Database: Neon Serverless PostgreSQL for managed, scalable database service
- ORM: SQLModel for type-safe database operations with SQLAlchemy/Pydantic integration
- Authentication: Better Auth for frontend and JWT middleware for backend

### Justification
- Next.js 16+ provides excellent performance with server-side rendering and file-based routing
- FastAPI offers high performance, automatic API documentation, and excellent async support
- Neon PostgreSQL provides serverless scalability, automatic scaling, and reduced operational overhead
- SQLModel provides type safety and seamless integration between SQLAlchemy and Pydantic
- Better Auth provides mature authentication solution with React integration

## Alternatives Considered

### Alternative 1: React + Express + MongoDB
- Pros: Large ecosystem, familiar technologies, flexible schema
- Cons: JavaScript everywhere but less performant than Python for backend, no built-in async support, less type safety

### Alternative 2: Remix + Node.js + PostgreSQL
- Pros: Excellent React framework, good performance, strong community
- Cons: Less async support than FastAPI, higher memory usage for backend

### Alternative 3: Django + React + PostgreSQL
- Pros: Mature Python framework, built-in admin interface, authentication
- Cons: Heavier than FastAPI, sync by default, less suitable for microservices approach

## Consequences

### Positive
- High-performance async backend with FastAPI (tested to handle 1000+ concurrent requests)
- Type-safe database operations with SQLModel reducing runtime errors
- Serverless database scaling with Neon reducing operational overhead
- Excellent developer experience with automatic API docs from FastAPI
- Modern React framework with Next.js App Router for optimal performance

### Negative
- Requires team to learn Next.js 16+ App Router if unfamiliar
- FastAPI is newer than Django/Flask, potentially smaller community
- Neon PostgreSQL may have vendor lock-in considerations
- Learning curve for SQLModel if team is used to other ORMs

## References

- [plan.md](../../specs/002-auth-jwt-security/plan.md)
- [research.md](../../specs/002-auth-jwt-security/research.md)
- [data-model.md](../../specs/002-auth-jwt-security/data-model.md)