import os
from pydantic import BaseModel

class Settings(BaseModel):
    OPENROUTER_API_KEY: str = os.getenv("OPENROUTER_API_KEY", "")
    OPENROUTER_BASE_URL: str = "https://openrouter.ai/api/v1"
    DEFAULT_MODEL: str = os.getenv("OPENROUTER_MODEL", "openai/gpt-4o")
    FALLBACK_MODEL: str = "anthropic/claude-3.5-sonnet"
    CACHE_DIR: str = os.path.join(os.path.dirname(__file__), "cache")
    DECAY_THRESHOLD: float = 4.0
    INITIAL_SHOCK_MAGNITUDE: float = 100.0

settings = Settings()
os.makedirs(settings.CACHE_DIR, exist_ok=True)
