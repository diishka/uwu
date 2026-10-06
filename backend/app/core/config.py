from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")
    database_url: str = "postgresql+asyncpg://uwu:password@db:5432/uwu"
    cors_origins: str = "http://localhost:5173"
    answer_salt: str = "change-me"
    app_env: str = "development"

settings = Settings()
