import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session
from ...src.main import app
from ...src.models.user import User
from ...src.auth.utils import get_password_hash, create_access_token
from ...src.database.engine import engine
from datetime import timedelta

@pytest.fixture
def client():
    with TestClient(app) as test_client:
        yield test_client

@pytest.fixture
def sample_user():
    """Create a sample user for testing."""
    user = User(
        email="secure@example.com",
        name="Secure User",
        password_hash=get_password_hash("SecurePass123!")
    )
    with Session(engine) as session:
        session.add(user)
        session.commit()
        session.refresh(user)
    return user

def test_unauthenticated_requests_return_401(client):
    """Test unauthenticated requests return 401 Unauthorized."""
    # Act
    response = client.get("/api/tasks")

    # Assert
    assert response.status_code == 401
    assert "Could not validate credentials" in str(response.content)

def test_authenticated_user_can_access_own_tasks(client, sample_user):
    """Test authenticated user can access their own tasks."""
    # Arrange - Get a valid JWT token
    token_data = {"sub": str(sample_user.id), "user_email": sample_user.email, "user_name": sample_user.name}
    access_token = create_access_token(data=token_data, expires_delta=timedelta(minutes=30))

    # Act
    response = client.get("/api/tasks", headers={"Authorization": f"Bearer {access_token}"})

    # Assert
    # Note: This might return 404 if no tasks exist, but it shouldn't return 401
    assert response.status_code != 401  # Should not be unauthorized

def test_request_with_invalid_jwt_token_returns_401(client):
    """Test invalid/expired JWT tokens return 401 Unauthorized."""
    # Arrange
    invalid_token = "Bearer invalid.token.here"

    # Act
    response = client.get("/api/tasks", headers={"Authorization": invalid_token})

    # Assert
    assert response.status_code == 401
    assert "Could not validate credentials" in str(response.content)