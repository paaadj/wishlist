"""
Configuration file
"""


import os


# pylint: disable=too-few-public-methods
class Settings:
    """
    Settings class
    """
    PROJECT_NAME: str = "Wishlist"
    PROJECT_VERSION: str = "0.0.1"

    USER: str = os.getenv("USER", default="admin")
    PASSWORD = os.getenv("PASSWORD", default="123456")
    SERVER: str = os.getenv("SERVER", default="localhost")
    PORT: str = os.getenv("PORT", default="3306")
    DB: str = os.getenv("DB", default="tdd")
    DATABASE_URL = f"mysql://{USER}:{PASSWORD}@{SERVER}:{PORT}/{DB}"

    SECRET_KEY: str = os.getenv("SECRET_KEY", default="AWESOME_SECRET_KEY")


settings = Settings()


TORTOISE_ORM = {
    "connections": {"default": f"{settings.DATABASE_URL}"},
    "apps": {
        "models": {
            "models": ["models.item", "models.user", "aerich.models"],
            "default_connection": "default",
        },
    },
}
