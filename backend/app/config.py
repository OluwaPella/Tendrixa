from functools import lru_cache
from typing import Optional

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # App
    app_name: str = "Tendrixa"
    app_env: str = "development"
    debug: bool = True
    secret_key: str = "change-me-in-production-use-openssl-rand-hex-32"
    api_v1_prefix: str = "/api/v1"
    cors_origins: str = "http://localhost:5173,http://127.0.0.1:5173"

    # Database
    database_url: str = "sqlite+aiosqlite:///./tendrixa.db"

    # AI (placeholder)
    ai_api_key: Optional[str] = None
    ai_base_url: Optional[str] = None
    ai_model: str = "gpt-4o-mini"

    # Buffer (placeholders — fill after developer app is created)
    buffer_client_id: Optional[str] = None
    buffer_client_secret: Optional[str] = None
    buffer_redirect_uri: str = "http://localhost:8000/api/v1/buffer/callback"
    buffer_api_base_url: str = "https://api.bufferapp.com"
    # TODO(BUFFER): Confirm the official Buffer API base URL and OAuth endpoints
    # after creating the Buffer developer application.
    # See: https://buffer.com/developers/api

    @property
    def cors_origins_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]

    @property
    def is_buffer_configured(self) -> bool:
        return bool(self.buffer_client_id and self.buffer_client_secret)


@lru_cache
def get_settings() -> Settings:
    return Settings()
