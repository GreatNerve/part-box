from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    database_url: str = "postgres://inventory:inventory@localhost:5432/inventory"
    jwt_secret: str = "dev-only-change-me-use-32-chars-min"
    jwt_expiry_minutes: int = 60 * 24 * 7  # 7 days
    cors_origins: str = "http://localhost:3000,http://localhost:5173"
    api_host: str = "0.0.0.0"
    api_port: int = 8000
    grpc_host: str = "0.0.0.0"
    grpc_port: int = 50051

    @property
    def cors_origins_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
