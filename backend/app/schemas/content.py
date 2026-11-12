from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, Field

from app.models.content import ContentStatus, Platform, ContentType


class ContentGenerateRequest(BaseModel):
    trend_id: Optional[UUID] = None
    trend_title: Optional[str] = None
    trend_context: Optional[str] = None
    platform: Platform
    content_type: ContentType = ContentType.SHORT_POST
    additional_instructions: Optional[str] = None


class ContentCreate(BaseModel):
    trend_id: Optional[UUID] = None
    title: Optional[str] = None
    body: str
    platform: Platform
    content_type: ContentType = ContentType.SHORT_POST
    source_trend_title: Optional[str] = None


class ContentUpdate(BaseModel):
    title: Optional[str] = None
    body: Optional[str] = None
    status: Optional[ContentStatus] = None
    scheduled_at: Optional[datetime] = None


class ContentRead(BaseModel):
    id: UUID
    user_id: Optional[UUID] = None
    trend_id: Optional[UUID] = None
    title: Optional[str] = None
    body: str
    platform: Platform
    content_type: ContentType
    status: ContentStatus
    source_trend_title: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    scheduled_at: Optional[datetime] = None
    published_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


class ContentListResponse(BaseModel):
    items: list[ContentRead]
    total: int
