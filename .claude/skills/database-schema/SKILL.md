---
name: database-schema
description: Design and manage database tables, migrations, and schemas. Use for scalable backend systems.
---

# Database Schema Design

## Instructions

1. **Table creation**
   - Define clear table names
   - Use appropriate data types
   - Set primary keys

2. **Relationships**
   - One-to-one, one-to-many, many-to-many
   - Use foreign keys
   - Maintain referential integrity

3. **Migrations**
   - Version-controlled schema changes
   - Reversible migrations (up & down)
   - Safe production updates

4. **Schema design**
   - Normalize data (avoid duplication)
   - Index frequently queried columns
   - Plan for scalability

## Best Practices
- Use snake_case for table and column names
- Always add timestamps (`created_at`, `updated_at`)
- Avoid over-normalization
- Document schema changes
- Test migrations before deployment

## Example Structure
```sql
-- users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- posts table
CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  body TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
