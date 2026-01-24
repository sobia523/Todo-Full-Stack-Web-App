from typing import Optional
from sqlmodel import Session, select
from ..models.user import User, UserCreate
from fastapi import HTTPException


class UserService:
    @staticmethod
    def get_user_by_id(*, session: Session, user_id: int) -> Optional[User]:
        """Get a user by ID"""
        statement = select(User).where(User.id == user_id)
        user = session.exec(statement).first()
        return user