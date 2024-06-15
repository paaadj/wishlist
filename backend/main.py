"""
Entry point
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from tortoise import Tortoise

from routing.admin_routes import router as admin_router
from routing.chat_routes import router as chat_router
from routing.notification_routes import router as notification_router
from routing.wishlist_routes import router as wishlist_router
from auth.routes import auth_router
from config import settings
from scheduler import (check_deferred_notifications, clear_refresh_tokens,
                       scheduler)

app = FastAPI()

origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def init():
    """
    Initial method
    Migrate db then connect to it
    Start scheduler then run all schedule jobs
    """
    # command = Command(tortoise_config=TORTOISE_ORM, app="models")
    # await command.init()
    # await command.migrate("update")
    # await command.upgrade(False)
    await Tortoise.init(
        db_url=settings.DATABASE_URL, modules={"models": settings.MODULE_LIST}
    )

    scheduler.start()
    await check_deferred_notifications()
    await clear_refresh_tokens()


@app.on_event("shutdown")
async def shutdown_db():
    """
    Shutdown method
    """
    await Tortoise.close_connections()
    scheduler.shutdown()


app.include_router(auth_router)
app.include_router(notification_router)
app.include_router(wishlist_router, prefix="/services")
app.include_router(chat_router, prefix="/services")
app.include_router(admin_router, prefix="/services")

if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, log_level="debug")
