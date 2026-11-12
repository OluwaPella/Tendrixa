from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, Field


class TrendBase(BaseModel):
    title: str
    description: Optional[str] = None
    category: str
    momentum: int = Field(ge=0, le=100)
    growth_pct: float = 0.0
    opportunity_score: int = Field(ge=0, le=100)
    why_it_matters: Optional[str] = None
    related_topics: list[str] = []
    sources: list[dict] = []
    image_url: Optional[str] = None
    is_featured: bool = False


class TrendCreate(TrendBase):
    external_id: Optional[str] = None


class TrendRead(TrendBase):
    id: UUID
    is_saved: bool = False
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class TrendAnalysisRead(BaseModel):
    id: UUID
    trend_id: UUID
    trend_score: int
    momentum: int
    audience_fit: int
    content_potential: int
    summary: Optional[str] = None
    audience_insights: Optional[str] = None
    content_opportunities: list[str] = []
    created_at: datetime

    model_config = {"from_attributes": True}


class TrendDetail(TrendRead):
    analysis: Optional[TrendAnalysisRead] = None


class TrendListResponse(BaseModel):
    items: list[TrendRead]
    total: int
    page: int = 1
    page_size: int = 20
