from datetime import datetime
from typing import Optional
from uuid import UUID

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.config import get_settings
from app.integrations.buffer.service import get_buffer_service
from app.integrations.buffer.schemas import BufferPostRequest, BufferPostResponse
from app.api.content import _CONTENT_STORE
from app.models.content import ContentStatus

router = APIRouter()
settings = get_settings()


class PublishRequest(BaseModel):
    content_id: UUID
    channel_ids: list[str] = []
    publish_now: bool = True
    scheduled_at: Optional[datetime] = None


class PublishResponse(BaseModel):
    success: bool
    message: str
    buffer_configured: bool
    external_post_id: Optional[str] = None


@router.post("/publish", response_model=PublishResponse)
async def publish_now(req: PublishRequest):
    content = _CONTENT_STORE.get(req.content_id)
    if not content:
        raise HTTPException(status_code=404, detail="Content not found")

    if content.status not in (ContentStatus.APPROVED, ContentStatus.DRAFT, ContentStatus.SCHEDULED):
        raise HTTPException(status_code=400, detail=f"Cannot publish content in status {content.status}")

    if not settings.is_buffer_configured:
        return PublishResponse(
            success=False,
            message=(
                "Buffer isn't connected yet. "
                "Connect your Buffer account to publish this content. "
                "Set BUFFER_CLIENT_ID and BUFFER_CLIENT_SECRET after creating your Buffer developer application."
            ),
            buffer_configured=False,
        )

    service = get_buffer_service()
    payload = BufferPostRequest(
        text=content.body,
        profile_ids=req.channel_ids,
        scheduled_at=None,
    )

    try:
        result: BufferPostResponse = await service.create_post(payload)
        if result.success:
            # Update local status (demo store)
            data = content.model_dump()
            data["status"] = ContentStatus.PUBLISHED
            data["published_at"] = datetime.utcnow()
            from app.schemas.content import ContentRead
            _CONTENT_STORE[content.id] = ContentRead(**data)
        return PublishResponse(
            success=result.success,
            message=result.message,
            buffer_configured=True,
            external_post_id=result.post_id,
        )
    except NotImplementedError as e:
        return PublishResponse(
            success=False,
            message=str(e),
            buffer_configured=True,
        )


@router.post("/schedule", response_model=PublishResponse)
async def schedule_post(req: PublishRequest):
    if not req.scheduled_at:
        raise HTTPException(status_code=400, detail="scheduled_at is required for scheduling")

    content = _CONTENT_STORE.get(req.content_id)
    if not content:
        raise HTTPException(status_code=404, detail="Content not found")

    if not settings.is_buffer_configured:
        return PublishResponse(
            success=False,
            message=(
                "Buffer isn't connected yet. "
                "Cannot schedule until Buffer is configured and connected."
            ),
            buffer_configured=False,
        )

    service = get_buffer_service()
    payload = BufferPostRequest(
        text=content.body,
        profile_ids=req.channel_ids,
        scheduled_at=req.scheduled_at.isoformat(),
    )

    try:
        result = await service.schedule_post(payload)
        if result.success:
            data = content.model_dump()
            data["status"] = ContentStatus.SCHEDULED
            data["scheduled_at"] = req.scheduled_at
            from app.schemas.content import ContentRead
            _CONTENT_STORE[content.id] = ContentRead(**data)
        return PublishResponse(
            success=result.success,
            message=result.message,
            buffer_configured=True,
            external_post_id=result.post_id,
        )
    except NotImplementedError as e:
        return PublishResponse(
            success=False,
            message=str(e),
            buffer_configured=True,
        )
