from typing import Optional
from uuid import UUID

from fastapi import APIRouter, HTTPException, Query

from app.schemas.trend import TrendListResponse, TrendDetail, TrendAnalysisRead
from app.services.trend_provider import get_trend_provider

router = APIRouter()


@router.get("", response_model=TrendListResponse)
async def list_trends(
    category: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=50),
    sort: str = Query("momentum", pattern="^(momentum|growth|opportunity|newest)$"),
):
    provider = get_trend_provider()
    return await provider.list_trends(
        category=category,
        search=search,
        page=page,
        page_size=page_size,
        sort=sort,
    )


@router.get("/{trend_id}", response_model=TrendDetail)
async def get_trend(trend_id: UUID):
    provider = get_trend_provider()
    trend = await provider.get_trend(trend_id)
    if not trend:
        raise HTTPException(status_code=404, detail="Trend not found")
    return trend


@router.post("/{trend_id}/analyse", response_model=TrendAnalysisRead)
async def analyse_trend(trend_id: UUID):
    provider = get_trend_provider()
    analysis = await provider.analyse_trend(trend_id)
    if not analysis:
        raise HTTPException(status_code=404, detail="Trend not found")
    return analysis
