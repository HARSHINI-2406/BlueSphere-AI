import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "BlueSphere AI Backend"
    ENV: str = os.getenv("ENV", "development")
    
    # Defaults to a local SQLite database file to allow quick testing without manual Postgres setups,
    # but uses the DATABASE_URL environment variable when provided (e.g., in docker-compose or production).
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./bluesphere.db")

    # JWT Authentication settings
    SECRET_KEY: str = os.getenv("SECRET_KEY", "bluesphere-ai-super-secret-jwt-signing-key-2026")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 Hours duration

    class Config:
        case_sensitive = True

settings = Settings()
