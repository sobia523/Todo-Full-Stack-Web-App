<!-- SYNC IMPACT REPORT
Version change: 1.0.0 → 1.1.0
Modified principles:
- Principle 1: Spec-driven development (all implementation must follow approved specs)
- Principle 2: Zero manual coding (all code generated via Claude Code)
- Principle 3: Security-by-design (authentication and user isolation enforced at every layer)
- Principle 4: Deterministic behavior (repeatable builds and predictable outputs)
- Principle 5: Clear separation of concerns (frontend, backend, auth, data)
Added sections: Key Standards, Technology Constraints, Development Constraints, Security Constraints, Quality Standards
Removed sections: None
Templates requiring updates: ✅ All updated
Follow-up TODOs: None
-->
# Todo Full-Stack Web Application Constitution

## Core Principles

### Spec-Driven Development
All implementation must follow approved specs. Every feature must be traceable to a written spec requirement. All API endpoints must be explicitly defined before implementation.

### Zero Manual Coding
All code generated via Claude Code. No direct/manual code edits allowed. Each spec implemented independently and validated before moving forward.

### Security-by-Design
Authentication and user isolation enforced at every layer. Authentication required for all task-related operations. Task ownership enforced on every database query. JWT verification must occur on every protected request.

### Deterministic Behavior
Repeatable builds and predictable outputs. Environment-based configuration (no secrets hardcoded). REST API must follow HTTP status code conventions.

### Clear Separation of Concerns
Frontend, backend, auth, and data layers must remain decoupled via REST APIs. Backend and frontend must remain decoupled via REST APIs.

## Key Standards

- Every feature must be traceable to a written spec requirement
- All API endpoints must be explicitly defined before implementation
- Authentication required for all task-related operations
- Task ownership enforced on every database query
- JWT verification must occur on every protected request
- Environment-based configuration (no secrets hardcoded)
- REST API must follow HTTP status code conventions

## Technology Constraints

- Frontend: Next.js 16+ (App Router)
- Backend: Python FastAPI
- ORM: SQLModel
- Database: Neon Serverless PostgreSQL
- Authentication: Better Auth (JWT-based)
- Spec system: Spec-Kit Plus

## Development Constraints

- Use Agentic Dev Stack workflow only: Write spec → Generate plan → Break into tasks → Implement via Claude Code
- No direct/manual code edits allowed
- Each spec implemented independently and validated before moving forward
- Backend and frontend must remain decoupled via REST APIs
- Shared JWT secret must be provided via environment variable (BETTER_AUTH_SECRET)

## Security Constraints

- All API endpoints require a valid JWT token after authentication is enabled
- Requests without valid tokens must return 401 Unauthorized
- Users may only access and modify their own tasks
- JWT tokens must be verified using signature and expiration checks
- No shared database sessions between frontend and backend

## Quality Standards

- Code must be production-ready and readable
- Clear error handling and descriptive error responses
- Consistent naming conventions across layers
- Database schema must support multi-user isolation

## Governance

All implementation must follow the Agentic Dev Stack workflow: Write spec → Generate plan → Break into tasks → Implement via Claude Code. Every change must be traceable to a spec requirement. All code generation must use Claude Code agents as specified in the technology stack. Compliance with security constraints is mandatory for all API endpoints and database operations.

**Version**: 1.1.0 | **Ratified**: 2026-01-17 | **Last Amended**: 2026-01-17