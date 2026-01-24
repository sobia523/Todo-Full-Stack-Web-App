import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session, select
from unittest.mock import patch
from ...src.main import app
from ...src.models.user import User
from ...src.database.engine import engine

@pytest.fixture
def client():
    with TestClient(app) as test_client:
        yield test_client

@pytest.fixture
def session():
    with Session(engine) as session:
        yield session

def test_registration_with_valid_credentials(client, session):
    """Test registration with valid credentials creates user account."""
    # Arrange
    user_data = {
        "email": "test@example.com",
        "password": "ValidPass123!",
        "name": "Test User"
    }

    # Act
    response = client.post("/api/auth/register", json=user_data)

    # Assert
    assert response.status_code == 201
    response_data = response.json()
    assert "id" in response_data
    assert response_data["email"] == "test@example.com"
    assert response_data["name"] == "Test User"

    # Verify user was created in database
    statement = select(User).where(User.email == "test@example.com")
    user = session.exec(statement).first()
    assert user is not None
    assert user.email == "test@example.com"

def test_registration_with_invalid_email_format(client):
    """Test registration with invalid email format returns error."""
    # Arrange
    user_data = {
        "email": "invalid-email",
        "password": "ValidPass123!",
        "name": "Test User"
    }

    # Act
    response = client.post("/api/auth/register", json=user_data)

    # Assert
    assert response.status_code == 400
    assert "Invalid email format" in response.json()["detail"]

def test_registration_with_duplicate_email(client):
    """Test registration with duplicate email returns conflict error."""
    # First, register a user
    user_data = {
        "email": "duplicate@example.com",
        "password": "ValidPass123!",
        "name": "Test User"
    }

    # Register the first user
    response = client.post("/api/auth/register", json=user_data)
    assert response.status_code == 201

    # Try to register with the same email
    response = client.post("/api/auth/register", json=user_data)

    # Assert
    assert response.status_code == 409
    assert "Email already registered" in response.json()["detail"]