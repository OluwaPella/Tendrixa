from fastapi import APIRouter

from app.api import health, trends, content, buffer, publishing

router = APIRouter()

router.include_router(health.router, tags=["Health"])
router.include_router(trends.router, prefix="/trends", tags=["Trends"])
router.include_router(content.router, prefix="/content", tags=["Content"])
router.include_router(buffer.router, prefix="/buffer", tags=["Buffer"])
router.include_router(publishing.router, prefix="/publishing", tags=["Publishing"])
