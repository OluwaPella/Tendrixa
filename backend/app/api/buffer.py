from typing import Optional

from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import RedirectResponse

from app.config import get_settings
from app.integrations.buffer.service import get_buffer_service
from app.integrations.buffer.schemas import BufferAuthUrlResponse, BufferChannelsResponse

router = APIRouter()
settings = get_settings()


@router.get("/connect", response_model=BufferAuthUrlResponse)
async def buffer_connect(state: Optional[str] = Query(None)):
    """
    Return the Buffer OAuth authorization URL (or a clear not-configured message).
    Frontend should redirect the user to authorization_url when configured=True.
    """
    service = get_buffer_service()
    return service.get_connect_url(state=state)


@router.get("/callback")
async def buffer_callback(
    code: Optional[str] = Query(None),
    state: Optional[str] = Query(None),
    error: Optional[str] = Query(None),
):
    """
    OAuth callback endpoint.
    Until Buffer is fully configured this will return a helpful error.
    """
    if error:
        raise HTTPException(status_code=400, detail=f"Buffer OAuth error: {error}")

    if not code:
        raise HTTPException(status_code=400, detail="Missing authorization code")

    if not settings.is_buffer_configured:
        raise HTTPException(
            status_code=503,
            detail=(
                "Buffer developer application is not configured. "
                "Set BUFFER_CLIENT_ID and BUFFER_CLIENT_SECRET."
            ),
        )

    service = get_buffer_service()
    try:
        result = await service.complete_oauth(code=code, state=state)
        # In a real flow we would store tokens and redirect to frontend success page
        return {
            "status": "success",
            "message": "Buffer connected (placeholder — real token exchange pending).",
            "data": result,
        }
    except NotImplementedError as e:
        raise HTTPException(status_code=501, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"OAuth failed: {e}")


@router.get("/channels", response_model=BufferChannelsResponse)
async def list_channels():
    """
    List connected Buffer channels / profiles.
    Always returns a clear message when integration is not ready.
    """
    service = get_buffer_service()
    try:
        return await service.get_channels()
    except NotImplementedError as e:
        return BufferChannelsResponse(
            channels=[],
            configured=settings.is_buffer_configured,
            connected=False,
            message=str(e),
        )
