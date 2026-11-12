from __future__ import annotations

from datetime import datetime
from typing import Optional
from uuid import UUID, uuid4

from sqlmodel import Field, SQLModel, Relationship


class User(SQLModel, table=True):
    __tablename__ = "users"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    email: str = Field(index=True, unique=True, max_length=255)
    full_name: Optional[str] = Field(default=None, max_length=255)
    avatar_url: Optional[str] = None
    is_active: bool = True
    is_pro: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationships
    contents: list["Content"] = Relationship(back_populates="user")
    connections: list["PublishingConnection"] = Relationship(back_populates="user")
