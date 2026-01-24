from sqlmodel import create_engine
from sqlalchemy import Engine
from typing import Generator
import os
from dotenv import load_dotenv

load_dotenv()

# Get database URL from environment variable
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./todo_app.db")

# For testing, we might want a different database
TEST_DATABASE_URL = os.getenv("TEST_DATABASE_URL", "sqlite:///./todo_app_test.db")

def get_engine(database_url: str = DATABASE_URL) -> Engine:
    """Create and return a database engine"""
    connect_args = {}

    # SQLite specific settings
    if database_url.startswith("sqlite"):
        connect_args["check_same_thread"] = False

    return create_engine(
        database_url,
        echo=False,  # Set to True for SQL query logging
        connect_args=connect_args
    )

# Create the default engine
engine = get_engine()


def create_db_and_tables():
    """Create database tables"""
    # Import here to avoid circular imports
    from sqlmodel import SQLModel

    # Import all models to register them with SQLModel metadata
    from ..models.user import User
    from ..models.task import Task

    SQLModel.metadata.create_all(engine)


def get_session() -> Generator:
    """Get database session"""
    from sqlmodel import Session

    with Session(engine) as session:
        yield session