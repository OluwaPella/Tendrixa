from typing import Optional
from pydantic import BaseModel


class BufferAuthUrlResponse(BaseModel):
    authorization_url: str
    configured: bool
    message: Optional[str] = None


class BufferTokenResponse(BaseModel):
    access_token: str
    refresh_token: Optional[str] = None
    expires_in: Optional[int] = None
    # TODO(BUFFER): Align fields with official Buffer OAuth token response


class BufferChannel(BaseModel):
    id: str
    service: str  # twitter, linkedin, facebook, instagram, etc.
    name: str
    avatar: Optional[str] = None
    # TODO(BUFFER): Map exact fields from Buffer profiles/channels endpoint


class BufferChannelsResponse(BaseModel):
    channels: list[BufferChannel]
    configured: bool
    connected: bool
    message: Optional[str] = None


class BufferPostRequest(BaseModel):
    text: str
    profile_ids: list[str]
    scheduled_at: Optional[str] = None  # ISO datetime if scheduling
    # TODO(BUFFER): Confirm required payload shape for create/update updates


class BufferPostResponse(BaseModel):
    success: bool
    post_id: Optional[str] = None
    message: str
    # TODO(BUFFER): Align with real Buffer response
