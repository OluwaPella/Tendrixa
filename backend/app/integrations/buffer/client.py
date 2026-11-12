"""
Buffer API HTTP client.

All real endpoint paths and request shapes are intentionally left as TODOs
until the official Buffer developer application is configured and the
current API documentation is verified.
"""

from typing import Any, Optional

import httpx

from app.config import get_settings


class BufferClient:
    def __init__(self, access_token: Optional[str] = None):
        self.settings = get_settings()
        self.access_token = access_token
        self.base_url = self.settings.buffer_api_base_url.rstrip("/")

    def _headers(self) -> dict[str, str]:
        headers = {"Accept": "application/json", "Content-Type": "application/json"}
        if self.access_token:
            # TODO(BUFFER): Confirm auth header format (Bearer vs access_token query param)
            headers["Authorization"] = f"Bearer {self.access_token}"
        return headers

    async def get(self, path: str, params: Optional[dict] = None) -> dict[str, Any]:
        # TODO(BUFFER): Replace path with official Buffer API endpoint
        # after the Buffer developer application has been configured.
        url = f"{self.base_url}{path}"
        async with httpx.AsyncClient(timeout=30.0) as client:
            resp = await client.get(url, headers=self._headers(), params=params or {})
            resp.raise_for_status()
            return resp.json()

    async def post(self, path: str, json: Optional[dict] = None) -> dict[str, Any]:
        # TODO(BUFFER): Replace path with official Buffer API endpoint
        url = f"{self.base_url}{path}"
        async with httpx.AsyncClient(timeout=30.0) as client:
            resp = await client.post(url, headers=self._headers(), json=json or {})
            resp.raise_for_status()
            return resp.json()
