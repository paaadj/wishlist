"""
Configuration file
"""


import os
from pathlib import Path

from dotenv import load_dotenv

env_path = Path(".") / ".env"
load_dotenv(dotenv_path=env_path)


# pylint: disable=too-few-public-methods
class Settings:
    """
    Settings class
    """
    PROJECT_NAME: str = "Wishlist"
    PROJECT_VERSION: str = "0.0.1"

    USER: str = os.getenv("POSTGRES_USER", default="admin")
    PASSWORD = os.getenv("POSTGRES_PASSWORD", default="123456")
    SERVER: str = os.getenv("POSTGRES_SERVER", default="localhost")
    PORT: str = os.getenv("POSTGRES_PORT", default="3306")
    DB: str = os.getenv("POSTGRES_DB", default="tdd")
    DATABASE_URL = f"mysql://{USER}:{PASSWORD}@{SERVER}:{PORT}/{DB}"

    SECRET_KEY: str = os.getenv("SECRET_KEY", default="AWESOME_SECRET_KEY")


settings = Settings()
