import pytest
from sqlmodel import create_engine
from sqlalchemy import StaticPool
from backend.src.database.engine import get_engine
from backend.src.main import app
from backend.src.database.base import create_db_and_tables
from sqlmodel import Session
from fastapi.testclient import TestClient


@pytest.fixture(name="session")
def session_fixture():
    engine = create_engine(
        "sqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    create_db_and_tables()
    with Session(engine) as session:
        yield session


@pytest.fixture(name="client")
def client_fixture():
    with TestClient(app) as client:
        yield client