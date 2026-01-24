---
id: 1
title: "Amend Constitution Todo App"
stage: constitution
date: 2026-01-17
surface: agent
model: claude-sonnet-4-5-20250929
feature: todo-full-stack-app
branch: 004-frontend-web-app
user: TLS
command: /sp.constitution
labels:
  - constitution
  - todo-app
  - spec-driven
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files_yaml:
  - .specify/memory/constitution.md
tests_yaml: []
prompt_text: |
  /sp.constitution

  Project: Todo Full-Stack Web Application (Spec-Driven, Agentic Development)

  Core principles:
  - Spec-driven development (all implementation must follow approved specs)
  - Zero manual coding (all code generated via Claude Code)
  - Security-by-design (authentication and user isolation enforced at every layer)
  - Deterministic behavior (repeatable builds and predictable outputs)
  - Clear separation of concerns (frontend, backend, auth, data)

  Key standards:
  - Every feature must be traceable to a written spec requirement
  - All API endpoints must be explicitly defined before implementation
  - Authentication required for all task-related operations
  - Task ownership enforced on every database query
  - JWT verification must occur on every protected request
  - Environment-based configuration (no secrets hardcoded)
  - REST API must follow HTTP status code conventions

  Technology constraints:
  - Frontend: Next.js 16+ (App Router)
  - Backend: Python FastAPI
  - ORM: SQLModel
  - Database: Neon Serverless PostgreSQL
  - Authentication: Better Auth (JWT-based)
  - Spec system: Spec-Kit Plus

  Development constraints:
  - Use Agentic Dev Stack workflow only:
    Write spec → Generate plan → Break into tasks → Implement via Claude Code
  - No direct/manual code edits allowed
  - Each spec implemented independently and validated before moving forward
  - Backend and frontend must remain decoupled via REST APIs
  - Shared JWT secret must be provided via environment variable (BETTER_AUTH_SECRET)

  Security constraints:
  - All API endpoints require a valid JWT token after authentication is enabled
  - Requests without valid tokens must return 401 Unauthorized
  - Users may only access and modify their own tasks
  - JWT tokens must be verified using signature and expiration checks
  - No shared database sessions between frontend and backend

  Quality standards:
  - Code must be production-ready and readable
  - Clear error handling and descriptive error responses
  - Consistent naming conventions across layers
  - Database schema must support multi-user isolation
  - Responsive UI required for desktop and mobile

  Success criteria:
  - All 5 basic-level features implemented as a web application
  - Full CRUD functionality with persistent storage
  - Secure multi-user task isolation verified
  - JWT-based authentication working end-to-end
  - Frontend and backend communicate only via authenticated REST APIs
  - Project passes spec-to-implementation traceability review
response_text: |
  Updated the constitution file to reflect the specific principles and constraints for the Todo Full-Stack Web Application. The updated constitution now includes:
  - Core Principles: Spec-driven development, Zero manual coding, Security-by-design, Deterministic behavior, Clear separation of concerns
  - Key Standards: Traceability to spec requirements, API endpoint definition, authentication requirements, etc.
  - Technology Constraints: Next.js 16+, Python FastAPI, SQLModel, Neon PostgreSQL, Better Auth
  - Development Constraints: Agentic Dev Stack workflow, no manual code edits
  - Security Constraints: JWT-based authentication, user isolation, etc.
  - Quality Standards: Production-ready code, error handling, naming conventions
outcome: |
  The constitution has been successfully updated from version 1.0.0 to 1.1.0 with specific principles and constraints for the Todo Full-Stack Web Application. The file now contains concrete values instead of template placeholders, and follows the spec-driven development approach with security-by-design principles.
evaluation: |
  The constitution update is complete and aligns with the project requirements. All template placeholders have been replaced with specific values for the Todo Full-Stack Web Application. The document now serves as a definitive guide for development practices, technology constraints, and security requirements.
---

# Constitution Update for Todo Full-Stack Web Application

## Summary
Updated the project constitution to reflect the specific principles and constraints for the Todo Full-Stack Web Application with concrete values instead of template placeholders.

## Details
The constitution file at `.specify/memory/constitution.md` has been updated with specific principles for spec-driven development, zero manual coding, security-by-design, deterministic behavior, and clear separation of concerns. The update includes technology constraints, development constraints, security requirements, and quality standards specific to the Todo Full-Stack Web Application project.

## Validation
- Template placeholders have been replaced with concrete values
- Version has been updated from 1.0.0 to 1.1.0
- All principles align with the user's requirements
- File saved successfully at `.specify/memory/constitution.md`