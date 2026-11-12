from __future__ import annotations

from datetime import datetime
from enum import Enum
from typing import Optional
from uuid import UUID, uuid4

from sqlmodel import Field, SQLModel, Relationship, Column, JSON


class ContentStatus(str, Enum):
    DRAFT = "draft"
    APPROVED = "approved"
    SCHEDULED = "scheduled"
    PUBLISHED = "published"
    FAILED = "failed"


class Platform(str, Enum):
    LINKEDIN = "linkedin"
    X = "x"
    FACEBOOK = "facebook"
    INSTAGRAM = "instagram"


class ContentType(str, Enum):
    SHORT_POST = "short_post"
    LONG_FORM = "long_form"
    THREAD = "thread"
    EDUCATIONAL = "educational"
    OPINION = "opinion"
    ANNOUNCEMENT = "announcement"
    STORY = "story"


class Content(SQLModel, table=True):
    __tablename__ = "contents"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    user_id: Optional[UUID] = Field(default=None, foreign_key="users.id", index=True)
    trend_id: Optional[UUID] = Field(default=None, foreign_key="trends.id", index=True)
    title: Optional[str] = Field(default=None, max_length=300)
    body: str
    platform: Platform
    content_type: ContentType = ContentType.SHORT_POST
    status: ContentStatus = ContentStatus.DRAFT
    source_trend_title: Optional[str] = None
    meta: dict = Field(default_factory=dict, sa_column=Column(JSON))
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    scheduled_at: Optional[datetime] = None
    published_at: Optional[datetime] = None

    user: Optional["User"] = Relationship(back_populates="contents")
    variants: list["ContentVariant"] = Relationship(back_populates="content")


class ContentVariant(SQLModel, table=True):
    __tablename__ = "content_variants"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    content_id: UUID = Field(foreign_key="contents.id", index=True)
    platform: Platform
    body: str
    is_primary: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)

    content: Optional[Content] = Relationship(back_populates="variants")
