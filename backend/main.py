"""
Main file
"""
import datetime
import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from tortoise import Tortoise
from scheduler import scheduler, clear_refresh_tokens
from models.user import RefreshToken
from auth.routes import auth_router
from api.wishlist_routes import api_router
from api.chat_routes import chat_router
from config import settings

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
    """
    await Tortoise.init(
        db_url=settings.DATABASE_URL, modules={"models": settings.MODULE_LIST}
    )

    scheduler.start()


@app.on_event("shutdown")
async def shutdown_db():
    """
    Shutdown method
    """
    await Tortoise.close_connections()
    scheduler.shutdown()


app.include_router(auth_router)
app.include_router(api_router, prefix="/api")
app.include_router(chat_router, prefix="/api")
if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, log_level="debug")
