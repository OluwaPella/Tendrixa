from typing import Optional
from uuid import UUID, uuid4
from datetime import datetime

from fastapi import APIRouter, HTTPException, Query

from app.schemas.content import (
    ContentGenerateRequest,
    ContentCreate,
    ContentUpdate,
    ContentRead,
    ContentListResponse,
)
from app.models.content import ContentStatus
from app.services.content_generator import get_content_generator

router = APIRouter()

# In-memory store for demo (replace with DB session in production paths)
_CONTENT_STORE: dict[UUID, ContentRead] = {}


@router.post("/generate", response_model=ContentRead)
async def generate_content(req: ContentGenerateRequest):
    generator = get_content_generator()
    content = await generator.generate(req)
    _CONTENT_STORE[content.id] = content
    return content


@router.get("", response_model=ContentListResponse)
async def list_content(
    status: Optional[ContentStatus] = Query(None),
    platform: Optional[str] = Query(None),
):
    items = list(_CONTENT_STORE.values())
    if status:
        items = [c for c in items if c.status == status]
    if platform:
        items = [c for c in items if c.platform.value == platform]
    items.sort(key=lambda c: c.created_at, reverse=True)
    return ContentListResponse(items=items, total=len(items))


@router.get("/{content_id}", response_model=ContentRead)
async def get_content(content_id: UUID):
    content = _CONTENT_STORE.get(content_id)
    if not content:
        raise HTTPException(status_code=404, detail="Content not found")
    return content


@router.patch("/{content_id}", response_model=ContentRead)
async def update_content(content_id: UUID, payload: ContentUpdate):
    content = _CONTENT_STORE.get(content_id)
    if not content:
        raise HTTPException(status_code=404, detail="Content not found")

    data = content.model_dump()
    update = payload.model_dump(exclude_unset=True)
    data.update(update)
    data["updated_at"] = datetime.utcnow()
    updated = ContentRead(**data)
    _CONTENT_STORE[content_id] = updated
    return updated


@router.post("", response_model=ContentRead)
async def create_content(payload: ContentCreate):
    content = ContentRead(
        id=uuid4(),
        user_id=None,
        trend_id=payload.trend_id,
        title=payload.title,
        body=payload.body,
        platform=payload.platform,
        content_type=payload.content_type,
        status=ContentStatus.DRAFT,
        source_trend_title=payload.source_trend_title,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
        scheduled_at=None,
        published_at=None,
    )
    _CONTENT_STORE[content.id] = content
    return content
