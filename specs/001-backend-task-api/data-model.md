# Data Model: Backend API & Database for Todo Full-Stack Web Application

## Entities

### User Entity
**Description**: Represents a registered user of the system with unique identifier for task ownership enforcement

**Fields**:
- `id`: Integer, Primary Key, Auto-increment
- `email`: String (unique), Required
- `created_at`: DateTime, Required, Default: current timestamp

**Validation Rules**:
- Email must be a valid email format
- Email must be unique across all users

**Relationships**:
- One-to-Many: User has many Tasks (via user_id foreign key)

### Task Entity
**Description**: Represents a user's todo item with properties including id, title, description, completion status, creation timestamp, and user ownership

**Fields**:
- `id`: Integer, Primary Key, Auto-increment
- `user_id`: Integer, Foreign Key to User.id, Required
- `title`: String, Required, Max length: 255 characters
- `description`: Text, Optional
- `completed`: Boolean, Required, Default: False
- `created_at`: DateTime, Required, Default: current timestamp
- `updated_at`: DateTime, Required, Default: current timestamp (updates on modification)

**Validation Rules**:
- Title must not be empty
- Title must be less than 255 characters
- user_id must reference an existing User
- Only the owner (user_id) can modify the task

**State Transitions**:
- `completed` field can transition from False to True (mark as complete) or True to False (mark as incomplete)

## Database Schema Design

### Tables
```
users
├── id (INTEGER, PK, AUTO_INCREMENT)
├── email (VARCHAR(255), UNIQUE, NOT NULL)
└── created_at (TIMESTAMP, NOT NULL)

tasks
├── id (INTEGER, PK, AUTO_INCREMENT)
├── user_id (INTEGER, FK users.id, NOT NULL)
├── title (VARCHAR(255), NOT NULL)
├── description (TEXT)
├── completed (BOOLEAN, NOT NULL, DEFAULT FALSE)
├── created_at (TIMESTAMP, NOT NULL)
└── updated_at (TIMESTAMP, NOT NULL)
```

### Indexes
- Index on `tasks.user_id` for efficient querying of user-specific tasks
- Unique index on `users.email` for validation

## Data Access Patterns

### Queries
1. **Get all tasks for a user**: SELECT * FROM tasks WHERE user_id = ?
2. **Get specific task for a user**: SELECT * FROM tasks WHERE id = ? AND user_id = ?
3. **Create new task**: INSERT INTO tasks (...) VALUES (...)
4. **Update task**: UPDATE tasks SET ... WHERE id = ? AND user_id = ?
5. **Delete task**: DELETE FROM tasks WHERE id = ? AND user_id = ?

### Data Isolation
- All queries must filter by user_id to ensure users can only access their own tasks
- Foreign key constraints ensure referential integrity
- No direct access to tasks without user_id verification