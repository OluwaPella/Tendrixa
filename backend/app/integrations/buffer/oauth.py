"""
Buffer OAuth helpers.

Do not invent OAuth URLs. Leave clear TODOs for the real Buffer OAuth
authorization and token endpoints once the developer application exists.
"""

from typing import Optional
from urllib.parse import urlencode

from app.config import get_settings
from app.integrations.buffer.schemas import BufferAuthUrlResponse, BufferTokenResponse


def get_authorization_url(state: Optional[str] = None) -> BufferAuthUrlResponse:
    """
    Build the Buffer OAuth authorization URL.

    Returns a clear "not configured" response when credentials are missing.
    """
    settings = get_settings()

    if not settings.is_buffer_configured:
        return BufferAuthUrlResponse(
            authorization_url="",
            configured=False,
            message=(
                "Buffer is not configured yet. "
                "Set BUFFER_CLIENT_ID and BUFFER_CLIENT_SECRET in your environment "
                "after creating a Buffer developer application."
            ),
        )

    # TODO(BUFFER):
    # Replace this placeholder with the official Buffer OAuth authorization endpoint
    # after the Buffer developer application has been configured.
    # Example structure only — verify against current Buffer docs:
    #   https://buffer.com/oauth2/authorize
    # Required params typically include: client_id, redirect_uri, response_type=code, state
    params = {
        "client_id": settings.buffer_client_id,
        "redirect_uri": settings.buffer_redirect_uri,
        "response_type": "code",
    }
    if state:
        params["state"] = state

    # Placeholder base — MUST be replaced with the real Buffer authorize URL
    authorize_base = "https://buffer.com/oauth2/authorize"  # TODO(BUFFER): verify
    authorization_url = f"{authorize_base}?{urlencode(params)}"

    return BufferAuthUrlResponse(
        authorization_url=authorization_url,
        configured=True,
        message=None,
    )


async def exchange_code_for_token(code: str) -> BufferTokenResponse:
    """
    Exchange an authorization code for access tokens.

    Raises a clear error when Buffer is not configured.
    """
    settings = get_settings()

    if not settings.is_buffer_configured:
        raise RuntimeError(
            "Buffer OAuth is not configured. "
            "Provide BUFFER_CLIENT_ID and BUFFER_CLIENT_SECRET."
        )

    # TODO(BUFFER):
    # Replace this placeholder with the official Buffer token endpoint
    # and the correct request body / form fields after developer app setup.
    # Typical flow: POST client_id, client_secret, code, redirect_uri, grant_type=authorization_code
    #
    # Example (DO NOT USE until verified):
    #   POST https://api.bufferapp.com/1/oauth2/token.json
    #   or the current official token URL

    raise NotImplementedError(
        "TODO(BUFFER): Implement exchange_code_for_token with the official "
        "Buffer token endpoint once credentials and docs are available."
    )


async def handle_oauth_callback(code: str, state: Optional[str] = None) -> dict:
    """
    High-level callback handler used by the API route.
    """
    # Will call exchange_code_for_token and persist the connection
    # once the real implementation exists.
    token_data = await exchange_code_for_token(code)
    return {
        "access_token": token_data.access_token,
        "refresh_token": token_data.refresh_token,
        # TODO(BUFFER): store securely, fetch user profile / channels
    }
