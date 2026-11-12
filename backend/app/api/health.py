from fastapi import APIRouter

from app.config import get_settings

router = APIRouter()
settings = get_settings()


@router.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": settings.app_name,
        "env": settings.app_env,
        "buffer_configured": settings.is_buffer_configured,
    }
