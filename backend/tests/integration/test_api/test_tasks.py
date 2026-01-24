from fastapi.testclient import TestClient
from backend.src.main import app
import json

client = TestClient(app)

def test_create_and_list_tasks():
    """Test creating and listing tasks for a user"""
    # Create a task for user 1
    response = client.post(
        "/api/1/tasks",
        json={"title": "Test task", "description": "This is a test task"}
    )
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Test task"
    assert data["description"] == "This is a test task"
    assert data["completed"] is False

    # Get the task by ID
    task_id = data["id"]
    response = client.get(f"/api/1/tasks/{task_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Test task"

    # List all tasks for user 1
    response = client.get("/api/1/tasks")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1
    assert any(task["id"] == task_id for task in data)

def test_update_task():
    """Test updating a task"""
    # Create a task first
    response = client.post(
        "/api/1/tasks",
        json={"title": "Original task", "description": "Original description"}
    )
    assert response.status_code == 201
    task_id = response.json()["id"]

    # Update the task
    response = client.put(
        f"/api/1/tasks/{task_id}",
        json={"title": "Updated task", "description": "Updated description"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Updated task"
    assert data["description"] == "Updated description"

def test_toggle_completion():
    """Test toggling task completion status"""
    # Create a task
    response = client.post(
        "/api/1/tasks",
        json={"title": "Completion test task", "description": "Task for testing completion"}
    )
    assert response.status_code == 201
    task_id = response.json()["id"]

    # Toggle completion to True
    response = client.patch(
        f"/api/1/tasks/{task_id}/complete",
        json={"completed": True}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["completed"] is True

    # Toggle completion back to False
    response = client.patch(
        f"/api/1/tasks/{task_id}/complete",
        json={"completed": False}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["completed"] is False

def test_delete_task():
    """Test deleting a task"""
    # Create a task
    response = client.post(
        "/api/1/tasks",
        json={"title": "Delete test task", "description": "Task for testing deletion"}
    )
    assert response.status_code == 201
    task_id = response.json()["id"]

    # Verify it exists
    response = client.get(f"/api/1/tasks/{task_id}")
    assert response.status_code == 200

    # Delete the task
    response = client.delete(f"/api/1/tasks/{task_id}")
    assert response.status_code == 200

    # Verify it's gone
    response = client.get(f"/api/1/tasks/{task_id}")
    assert response.status_code == 404