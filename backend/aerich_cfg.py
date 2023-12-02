from config import settings

TORTOISE_ORM = {
    "connections": {
        "default": f"{settings.DATABASE_URL}"
    },
    "apps": {
        "models": {
            "models": settings.MODULE_LIST + ["aerich.models"],
            "default_connection": "default",
        },
    },
}
