from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Runtime configuration loaded from environment variables."""

    app_name: str = "Maker Lab Map P API"
    app_env: str = "development"
    frontend_origin: str = "http://localhost:3000"
    database_url: str = "postgresql://makerfinder:makerfinder@localhost:5432/makerfinder"
    redis_url: str = "redis://localhost:6379/0"
    google_maps_api_key: str | None = None
    firecrawl_api_key: str | None = None
    yelp_api_key: str | None = None

    model_config = SettingsConfigDict(
        env_file=("../.env", ".env"),
        env_file_encoding="utf-8",
        extra="ignore",
    )


@lru_cache
def get_settings() -> Settings:
    """Return one shared settings object for the process."""

    return Settings()
