from __future__ import annotations

from datetime import datetime
from typing import Optional
from uuid import UUID, uuid4

from sqlmodel import Field, SQLModel, Relationship, Column, JSON


class Trend(SQLModel, table=True):
    __tablename__ = "trends"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    external_id: Optional[str] = Field(default=None, index=True, max_length=128)
    title: str = Field(max_length=500)
    description: Optional[str] = None
    category: str = Field(index=True, max_length=64)
    momentum: int = Field(default=0, ge=0, le=100)
    growth_pct: float = Field(default=0.0)
    opportunity_score: int = Field(default=0, ge=0, le=100)
    why_it_matters: Optional[str] = None
    related_topics: list[str] = Field(default_factory=list, sa_column=Column(JSON))
    sources: list[dict] = Field(default_factory=list, sa_column=Column(JSON))
    image_url: Optional[str] = None
    is_featured: bool = False
    is_saved: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    analysis: Optional["TrendAnalysis"] = Relationship(
        back_populates="trend",
        sa_relationship_kwargs={"uselist": False},
    )


class TrendAnalysis(SQLModel, table=True):
    __tablename__ = "trend_analyses"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    trend_id: UUID = Field(foreign_key="trends.id", index=True)
    trend_score: int = Field(default=0, ge=0, le=100)
    momentum: int = Field(default=0, ge=0, le=100)
    audience_fit: int = Field(default=0, ge=0, le=100)
    content_potential: int = Field(default=0, ge=0, le=100)
    summary: Optional[str] = None
    audience_insights: Optional[str] = None
    content_opportunities: list[str] = Field(default_factory=list, sa_column=Column(JSON))
    created_at: datetime = Field(default_factory=datetime.utcnow)

    trend: Optional[Trend] = Relationship(back_populates="analysis")
