import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session
from ...src.main import app
from ...src.models.user import User
from ...src.auth.utils import get_password_hash
from ...src.database.engine import engine

@pytest.fixture
def client():
    with TestClient(app) as test_client:
        yield test_client

@pytest.fixture
def sample_user():
    """Create a sample user for testing."""
    user = User(
        email="test@example.com",
        name="Test User",
        password_hash=get_password_hash("ValidPass123!")
    )
    with Session(engine) as session:
        session.add(user)
        session.commit()
        session.refresh(user)
    return user

def test_login_with_valid_credentials(client, sample_user):
    """Test valid credentials return JWT token."""
    # Arrange
    login_data = {
        "email": "test@example.com",
        "password": "ValidPass123!"
    }

    # Act
    response = client.post("/api/auth/login", json=login_data)

    # Assert
    assert response.status_code == 200
    response_data = response.json()
    assert "access_token" in response_data
    assert response_data["token_type"] == "bearer"
    assert isinstance(response_data["expires_in"], int)

def test_login_with_invalid_credentials(client):
    """Test invalid credentials return authentication failure."""
    # Arrange
    login_data = {
        "email": "nonexistent@example.com",
        "password": "WrongPassword123!"
    }

    # Act
    response = client.post("/api/auth/login", json=login_data)

    # Assert
    assert response.status_code == 401
    assert "Incorrect email or password" in response.json()["detail"]

def test_login_with_invalid_email_format(client):
    """Test login with invalid email format returns error."""
    # Arrange
    login_data = {
        "email": "invalid-email",
        "password": "ValidPass123!"
    }

    # Act
    response = client.post("/api/auth/login", json=login_data)

    # Assert
    assert response.status_code == 400
    assert "Invalid email format" in response.json()["detail"]