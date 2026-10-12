import os
from dotenv import load_dotenv
from pydantic import BaseModel

load_dotenv()

class Settings(BaseModel):
    OPENROUTER_API_KEY: str = os.getenv("OPENROUTER_API_KEY", "")
    OPENROUTER_BASE_URL: str = "https://openrouter.ai/api/v1"
    DEFAULT_MODEL: str = os.getenv("OPENROUTER_MODEL", "openai/gpt-4o")
    OPENROUTER_MODEL: str = os.getenv("OPENROUTER_MODEL", "openai/gpt-4o")
    FALLBACK_MODEL: str = "anthropic/claude-3.5-sonnet"
    ALPHA_VANTAGE_API_KEY: str = os.getenv("ALPHA_VANTAGE_API_KEY", "V2AKQHWKPOSIOWJT")
    CACHE_DIR: str = os.path.join(os.path.dirname(__file__), "cache")
    DECAY_THRESHOLD: float = 4.0
    INITIAL_SHOCK_MAGNITUDE: float = 100.0

    # Hosted Chroma Cloud credentials
    CHROMA_HOST: str = os.getenv("CHROMA_HOST", "api.trychroma.com")
    CHROMA_API_KEY: str = os.getenv("CHROMA_API_KEY", "")
    CHROMA_TENANT: str = os.getenv("CHROMA_TENANT", "")
    CHROMA_DATABASE: str = os.getenv("CHROMA_DATABASE", "find")

settings = Settings()
os.makedirs(settings.CACHE_DIR, exist_ok=True)
