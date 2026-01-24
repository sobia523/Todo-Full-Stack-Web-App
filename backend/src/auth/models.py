from sqlmodel import SQLModel, Field
from typing import Optional
import uuid
from datetime import datetime

class JWTTokenBase(SQLModel):
    user_id: uuid.UUID = Field(foreign_key="user.id")
    token_hash: str = Field(index=True)
    expires_at: datetime
    is_revoked: bool = Field(default=False)
    device_info: Optional[str] = None

class JWTToken(JWTTokenBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)