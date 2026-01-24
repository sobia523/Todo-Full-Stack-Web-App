from typing import Generator
from sqlmodel import Session
from ..database.engine import get_session


def get_db_session() -> Generator[Session, None, None]:
    """Dependency to get database session"""
    session_generator = get_session()
    session = next(session_generator)
    try:
        yield session
    finally:
        session.close()