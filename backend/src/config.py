import os
from pydantic_settings import BaseSettings
from pydantic import ConfigDict

class Settings(BaseSettings):
    model_config = ConfigDict(extra='ignore')

    better_auth_secret: str = os.getenv("BETTER_AUTH_SECRET", "your-super-secret-jwt-key-here-make-it-long-and-random")
    access_token_expire_minutes: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))
    refresh_token_expire_days: int = int(os.getenv("REFRESH_TOKEN_EXPIRE_DAYS", "7"))
    database_url: str = os.getenv("DATABASE_URL", "sqlite:///./todo_app.db")  # Default to SQLite

settings = Settings()