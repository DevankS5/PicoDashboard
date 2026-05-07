from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    mongodb_url: str
    port: int = 3001
    node_env: str = "development"
    health_check_interval_ms: int = 300000
    health_check_timeout_ms: int = 5000
    frontend_origin: str = "http://localhost:5173"

    class Config:
        env_file = ".env"
        case_sensitive = False


settings = Settings()
