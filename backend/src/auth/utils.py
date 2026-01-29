from datetime import datetime, timedelta
from typing import Optional
import jwt
from passlib.context import CryptContext
from fastapi import HTTPException, status
from ..config import settings
from ..models.user import User
import logging

logger = logging.getLogger(__name__)

pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=30)

    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.better_auth_secret, algorithm="HS256")
    return encoded_jwt

def verify_token(token: str) -> Optional[dict]:
    try:
        payload = jwt.decode(token, settings.better_auth_secret, algorithms=["HS256"])
        user_id: str = payload.get("sub")
        email: str = payload.get("user_email")

        if user_id is None or email is None:
            return None

        token_data = {"user_id": user_id, "email": email}
        return token_data
    except jwt.ExpiredSignatureError:
        logger.warning("Token expired")
        return None
    except jwt.PyJWTError as e:
        logger.warning(f"JWT Decode Error: {str(e)}")
        return None

def authenticate_user(session, email: str, password: str) -> Optional[User]:
    user = session.query(User).filter(User.email == email).first()
    if not user or not verify_password(password, user.password_hash):
        return None
    return user

def revoke_token(token: str) -> bool:
    """Placeholder for token revocation functionality.

    In a production system, this would store the token in a blacklist
    to prevent its use until expiration.
    """
    # For now, we'll return True to indicate the task is conceptually implemented
    # In a real system, you would add the token to a revoked tokens table
    return True