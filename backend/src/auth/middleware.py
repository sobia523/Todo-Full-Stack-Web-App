from fastapi import HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from typing import Optional
from ..database import get_session
from .utils import verify_token
from ..models.user import User

import logging
import uuid
security = HTTPBearer(auto_error=False)
logger = logging.getLogger(__name__)

async def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
    session: Session = Depends(get_session)
) -> User:
    if credentials is None:
        print("DEBUG: No Authorization header sent! Request is missing valid 'Authorization: Bearer <token>' header.")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    token = credentials.credentials
    print(f"DEBUG: get_current_user called with token: {token[:10]}...")
    token_data = verify_token(token)
    if token_data is None:
        print("DEBUG: Token verification failed (verify_token returned None)")
        logger.warning("Token verification failed")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Convert user_id to UUID if necessary
    try:
        user_uuid = uuid.UUID(token_data["user_id"])
    except ValueError:
        print(f"DEBUG: Invalid UUID in token: {token_data.get('user_id')}")
        logger.error(f"Invalid UUID format in token: {token_data['user_id']}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid user ID format",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user = session.get(User, user_uuid)
    if user is None:
        print(f"DEBUG: User not found in DB for ID: {user_uuid}")
        logger.warning(f"User not found for ID: {user_uuid}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not user.is_active:
        print(f"DEBUG: User {user_uuid} is inactive")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Inactive user",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return user