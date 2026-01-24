# Quickstart Guide: Backend API & Database for Todo Full-Stack Web Application

## Overview
This guide provides instructions for setting up and running the backend API for the Todo application.

## Prerequisites
- Python 3.11+
- Poetry or pip for dependency management
- Access to Neon Serverless PostgreSQL database

## Setup Instructions

### 1. Clone the repository
```bash
git clone <repository-url>
cd <repository-directory>
```

### 2. Install dependencies
Using Poetry:
```bash
poetry install
```

Or using pip:
```bash
pip install -r requirements.txt
```

### 3. Environment Configuration
Create a `.env` file in the backend directory with the following variables:
```env
DATABASE_URL=postgresql://username:password@neon-host.region.neon.tech/dbname
TEST_DATABASE_URL=postgresql://username:password@neon-host.region.neon.tech/test_dbname
```

### 4. Database Setup
Run the database migrations to create the required tables:
```bash
# If using alembic for migrations
alembic upgrade head
```

Alternatively, the application should automatically create tables if they don't exist on startup.

### 5. Run the application
```bash
cd backend
python main.py
# or using uvicorn
uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
```

## API Usage Examples

### List all tasks for a user
```bash
curl -X GET http://localhost:8000/api/1/tasks
```

### Create a new task
```bash
curl -X POST http://localhost:8000/api/1/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Sample task", "description": "This is a sample task"}'
```

### Get a specific task
```bash
curl -X GET http://localhost:8000/api/1/tasks/1
```

### Update a task
```bash
curl -X PUT http://localhost:8000/api/1/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"title": "Updated task title", "description": "Updated description"}'
```

### Delete a task
```bash
curl -X DELETE http://localhost:8000/api/1/tasks/1
```

### Toggle task completion
```bash
curl -X PATCH http://localhost:8000/api/1/tasks/1/complete
```

## Testing
Run the test suite to verify the API is working correctly:
```bash
pytest tests/
```

## Troubleshooting
- If you get database connection errors, verify your DATABASE_URL is correct
- If endpoints return 404, ensure the user_id in the URL corresponds to an existing user
- Check logs for detailed error messages if requests fail