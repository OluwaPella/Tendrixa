from __future__ import annotations

from datetime import datetime
from typing import Optional
from uuid import UUID, uuid4

from sqlmodel import Field, SQLModel, Relationship, Column, JSON


class PublishingConnection(SQLModel, table=True):
    """Represents a connected Buffer account (or other publisher)."""

    __tablename__ = "publishing_connections"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    user_id: UUID = Field(foreign_key="users.id", index=True)
    provider: str = Field(default="buffer", max_length=32)  # buffer for now
    access_token: Optional[str] = None  # encrypted in production
    refresh_token: Optional[str] = None
    token_expires_at: Optional[datetime] = None
    provider_user_id: Optional[str] = None
    provider_username: Optional[str] = None
    channels: list[dict] = Field(default_factory=list, sa_column=Column(JSON))
    is_active: bool = False  # remains False until real OAuth succeeds
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    user: Optional["User"] = Relationship(back_populates="connections")


class ScheduledPost(SQLModel, table=True):
    __tablename__ = "scheduled_posts"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    content_id: UUID = Field(foreign_key="contents.id", index=True)
    connection_id: Optional[UUID] = Field(default=None, foreign_key="publishing_connections.id")
    channel_id: Optional[str] = None  # Buffer channel/profile id
    platform: str = Field(max_length=32)
    scheduled_at: Optional[datetime] = None
    published_at: Optional[datetime] = None
    status: str = Field(default="pending", max_length=32)  # pending | scheduled | published | failed
    external_post_id: Optional[str] = None
    error_message: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
