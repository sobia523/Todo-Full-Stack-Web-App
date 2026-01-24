# Todo Backend API

Backend API for the Todo Full-Stack Web Application using Python FastAPI and SQLModel with Neon Serverless PostgreSQL.

## Overview

This backend provides a REST API for managing user tasks with multi-user isolation and persistent storage. The API enforces user ownership of tasks to ensure data isolation.

## Tech Stack

- Python 3.11
- FastAPI
- SQLModel
- Pydantic
- Neon Serverless PostgreSQL

## Installation

1. Clone the repository
2. Navigate to the backend directory
3. Install dependencies:

```bash
pip install -r requirements.txt
```

Or using poetry:

```bash
poetry install
```

## Configuration

Copy the example environment file:

```bash
cp .env.example .env
```

Update the database connection strings in the `.env` file.

## Running the Application

```bash
cd backend
python -m uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
```

Or using the main module:

```bash
cd backend
python src/main.py
```

## API Endpoints

All endpoints follow the pattern `/api/{user_id}/...` to ensure user isolation:

- `GET /api/{user_id}/tasks` - List all tasks for a user
- `POST /api/{user_id}/tasks` - Create a new task for a user
- `GET /api/{user_id}/tasks/{id}` - Get details of a specific task
- `PUT /api/{user_id}/tasks/{id}` - Update a specific task
- `DELETE /api/{user_id}/tasks/{id}` - Delete a specific task
- `PATCH /api/{user_id}/tasks/{id}/complete` - Toggle completion status

## Testing

Run the tests using pytest:

```bash
pytest tests/
```

## Database Models

### User
- `id`: Integer (Primary Key)
- `email`: String (Unique)
- `created_at`: DateTime

### Task
- `id`: Integer (Primary Key)
- `user_id`: Integer (Foreign Key to User)
- `title`: String (Required, max 255 chars)
- `description`: Text (Optional)
- `completed`: Boolean (Default: False)
- `created_at`: DateTime
- `updated_at`: DateTime

## Security

The API enforces user isolation by:
- Filtering all queries by `user_id`
- Returning 404 for resources that don't belong to the specified user
- Preventing access to tasks belonging to other users