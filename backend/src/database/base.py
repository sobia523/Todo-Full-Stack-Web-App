from sqlmodel import SQLModel

# Import all models to register them with SQLModel metadata
from ..models.user import User
from ..models.task import Task

__all__ = ["SQLModel"]