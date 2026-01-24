from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, status, Header
from sqlalchemy.orm import Session
from pydantic import EmailStr
import re
from ..deps import get_db_session
from ...models.user import User as AuthUser, UserCreate, UserRead
from ...auth.utils import verify_password, get_password_hash, create_access_token, revoke_token
from ...auth.middleware import get_current_user
from ...config import settings
from ...models.task import Task

# Rate limiting implementation
from collections import defaultdict
import time

# Simple in-memory rate limiter (for production, use Redis or similar)
login_attempts = defaultdict(list)

def is_rate_limited(email: str, max_attempts: int = 5, window_seconds: int = 300) -> bool:
    """Check if a user has exceeded the rate limit for login attempts."""
    now = time.time()
    attempts = [attempt_time for attempt_time in login_attempts[email] if now - attempt_time < window_seconds]
    login_attempts[email] = attempts

    if len(attempts) >= max_attempts:
        return True

    login_attempts[email].append(now)
    return False

router = APIRouter(prefix="/auth", tags=["authentication"])

def validate_email_format(email: str) -> bool:
    """Validate email format using regex"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def sanitize_input(input_str: str) -> str:
    """Sanitize input string by removing potentially harmful characters."""
    if input_str is None:
        return None

    # Remove potentially harmful characters while preserving allowed ones
    sanitized = re.sub(r'[<>"\'&]', '', input_str)
    return sanitized.strip()

def validate_password_strength(password: str) -> tuple[bool, str]:
    """Validate password strength and return (is_valid, error_message)"""
    if len(password) < 8:
        return False, "Password must be at least 8 characters long"

    if len(password) > 128:  # Prevent extremely long passwords
        return False, "Password must be less than 128 characters"

    if not re.search(r'[A-Z]', password):
        return False, "Password must contain at least one uppercase letter"

    if not re.search(r'[a-z]', password):
        return False, "Password must contain at least one lowercase letter"

    if not re.search(r'\d', password):
        return False, "Password must contain at least one digit"

    if not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
        return False, "Password must contain at least one special character"

    return True, ""

@router.post("/register", response_model=UserRead, status_code=201)
async def register(user: UserCreate, session: Session = Depends(get_db_session)):
    # Sanitize inputs
    sanitized_email = sanitize_input(user.email) if user.email else user.email
    sanitized_name = sanitize_input(user.name) if user.name else user.name
    sanitized_password = user.password  # Don't sanitize password but validate it

    # Validate email format
    if not validate_email_format(sanitized_email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid email format"
        )

    # Validate password strength
    is_valid, error_msg = validate_password_strength(sanitized_password)
    if not is_valid:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=error_msg
        )

    # Validate name length
    if len(sanitized_name) > 100:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Name must be less than 100 characters"
        )

    # Check if user already exists
    existing_user = session.query(AuthUser).filter(AuthUser.email == sanitized_email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered"
        )

    # Create new user
    db_user = AuthUser(
        email=sanitized_email,
        name=sanitized_name,
        password_hash=get_password_hash(sanitized_password)
    )

    session.add(db_user)
    session.commit()
    session.refresh(db_user)

    return db_user

@router.post("/login")
async def login(email: str, password: str, session: Session = Depends(get_db_session)):
    # Validate email format
    if not validate_email_format(email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid email format"
        )

    # Check rate limiting
    if is_rate_limited(email):
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many login attempts. Please try again later."
        )

    user = session.query(AuthUser).filter(AuthUser.email == email).first()

    if not user or not verify_password(password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Update last login time
    user.last_login_at = datetime.utcnow()
    session.add(user)
    session.commit()

    access_token_expires = timedelta(minutes=settings.access_token_expire_minutes)
    access_token = create_access_token(
        data={"sub": str(user.id), "user_email": user.email, "user_name": user.name},
        expires_delta=access_token_expires
    )

    # Reset rate limit attempts after successful login
    if email in login_attempts:
        del login_attempts[email]

    return {
        "success": True,
        "data": {
            "user": {
                "id": str(user.id),
                "email": user.email,
                "name": user.name
            },
            "access_token": access_token,
            "token_type": "bearer",
            "expires_in": access_token_expires.seconds
        }
    }

@router.post("/logout")
async def logout(authorization: str = Header(None), current_user: AuthUser = Depends(get_current_user)):
    """Logout endpoint that revokes the current token."""
    if authorization and authorization.startswith("Bearer "):
        token = authorization[len("Bearer "):]

        # Revoke the token
        success = revoke_token(token)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Unable to logout"
            )

    return {"message": "Successfully logged out"}


@router.get("/me", response_model=UserRead)
async def read_users_me(current_user: AuthUser = Depends(get_current_user)):
    return current_user