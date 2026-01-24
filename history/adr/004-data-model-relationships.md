---
adr: 4
title: Data Model - User-Task Relationships with Foreign Key Constraints
date: 2026-01-17
status: Proposed
authors:
  - TLS
reviewers:
  - team
---

# ADR 4: Data Model - User-Task Relationships with Foreign Key Constraints

## Status

Proposed

## Context

The Todo Full-Stack Web Application requires a data model that properly enforces user data isolation while maintaining referential integrity and supporting efficient queries. The system must ensure that users can only access their own tasks while maintaining good performance for common operations.

Key requirements include:
- User data isolation enforced at the database level
- Efficient queries for user-specific task retrieval
- Referential integrity between users and tasks
- Support for 10k+ users and associated tasks
- Proper indexing for authentication and task access patterns

## Decision

We will implement a normalized data model with explicit foreign key relationships:
- User table with unique email constraint and proper indexing
- Task table with user_id foreign key referencing User table
- Foreign key constraint enforcing referential integrity
- Proper indexing on user_id for efficient user-specific queries
- Updated Task entity to include user relationship

### Data Model Structure
- User entity with id (UUID), email (unique, indexed), password_hash, name, and timestamps
- Task entity with user_id (foreign key, indexed), title, description, completed status, and timestamps
- Foreign key constraint preventing orphaned tasks
- Indexes on user_id for efficient filtering by authenticated user

## Alternatives Considered

### Alternative 1: Denormalized Model with User ID in Task Only
- Store user_id in tasks but without foreign key constraints
- Pros: Simpler queries, potentially faster writes
- Cons: No referential integrity enforcement, risk of orphaned records, doesn't meet data integrity requirements

### Alternative 2: Document-based Storage (MongoDB-style)
- Store user and task data in documents with embedded references
- Pros: Flexible schema, potential performance benefits for related data
- Cons: Doesn't align with selected PostgreSQL technology, harder to enforce data integrity, more complex for relational queries

### Alternative 3: Soft Deletion for Users
- Mark users as deleted rather than removing them
- Pros: Preserves historical data, prevents orphaned tasks
- Cons: More complex queries, larger dataset over time, potential privacy concerns

## Consequences

### Positive
- Enforces data integrity at the database level with foreign key constraints
- Enables efficient user-specific queries with proper indexing
- Maintains referential integrity preventing orphaned tasks
- Supports the required user data isolation through foreign key relationships
- Enables proper cascading operations if needed in the future
- Provides clear audit trail of user-task relationships

### Negative
- Slightly more complex queries due to joins (though optimized with indexing)
- Requires careful migration strategy for existing data
- May require more complex transaction management for related operations
- Additional storage overhead for foreign key indexes

## References

- [plan.md](../../specs/002-auth-jwt-security/plan.md)
- [data-model.md](../../specs/002-auth-jwt-security/data-model.md)
- [api-contracts.md](../../specs/002-auth-jwt-security/contracts/api-contracts.md)