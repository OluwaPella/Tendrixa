"""
Buffer integration service layer.

All methods that would call the real Buffer API raise clear
NotImplemented / configuration errors until the developer app is ready.
"""

from typing import Optional

from app.config import get_settings
from app.integrations.buffer.client import BufferClient
from app.integrations.buffer.oauth import get_authorization_url, handle_oauth_callback
from app.integrations.buffer.schemas import (
    BufferAuthUrlResponse,
    BufferChannelsResponse,
    BufferChannel,
    BufferPostRequest,
    BufferPostResponse,
)


class BufferService:
    def __init__(self, access_token: Optional[str] = None):
        self.settings = get_settings()
        self.client = BufferClient(access_token=access_token)

    def get_connect_url(self, state: Optional[str] = None) -> BufferAuthUrlResponse:
        return get_authorization_url(state=state)

    async def complete_oauth(self, code: str, state: Optional[str] = None) -> dict:
        return await handle_oauth_callback(code=code, state=state)

    async def get_channels(self) -> BufferChannelsResponse:
        if not self.settings.is_buffer_configured:
            return BufferChannelsResponse(
                channels=[],
                configured=False,
                connected=False,
                message=(
                    "Buffer isn't connected yet. "
                    "Connect your Buffer account to publish this content."
                ),
            )

        if not self.client.access_token:
            return BufferChannelsResponse(
                channels=[],
                configured=True,
                connected=False,
                message="Buffer is configured but no account is connected for this user.",
            )

        # TODO(BUFFER):
        # Replace with official Buffer profiles / channels endpoint.
        # Example (verify against current docs):
        #   GET /1/profiles.json
        raise NotImplementedError(
            "TODO(BUFFER): Implement get_channels() against the official Buffer API."
        )

    async def create_post(self, payload: BufferPostRequest) -> BufferPostResponse:
        if not self.settings.is_buffer_configured:
            return BufferPostResponse(
                success=False,
                message=(
                    "Buffer isn't connected yet. "
                    "Configure BUFFER_CLIENT_ID / BUFFER_CLIENT_SECRET and complete OAuth."
                ),
            )

        # TODO(BUFFER):
        # Replace with official create update / post endpoint.
        # Do not invent payload or response shapes.
        raise NotImplementedError(
            "TODO(BUFFER): Implement create_post() with the official Buffer API."
        )

    async def schedule_post(self, payload: BufferPostRequest) -> BufferPostResponse:
        if not payload.scheduled_at:
            return await self.create_post(payload)

        if not self.settings.is_buffer_configured:
            return BufferPostResponse(
                success=False,
                message="Buffer isn't connected yet. Cannot schedule.",
            )

        # TODO(BUFFER): Implement schedule using official API (often same endpoint with due_at)
        raise NotImplementedError(
            "TODO(BUFFER): Implement schedule_post() with the official Buffer API."
        )


def get_buffer_service(access_token: Optional[str] = None) -> BufferService:
    return BufferService(access_token=access_token)
