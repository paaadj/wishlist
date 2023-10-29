"""
Module for token creation
"""


import time

import jwt
from fastapi import HTTPException, status
from pydantic import BaseModel

from config import settings
from models.user import RefreshToken, User, UserPydantic

JWT_SECRET = settings.SECRET_KEY
ALGORITHM = "HS256"


async def create_tokens(user: User):
    """
    Create tokens
    :param user: user
    :return: tokens
    """
    access_token = await create_access_token(user)
    refresh_token = await create_refresh_token(user)
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
    }


async def create_access_token(user: User):
    """
    create access token for user
    :param user: user
    :return: access token
    """
    user_obj = await UserPydantic.from_tortoise_orm(user)
    sub = user_obj.dict()
    sub["scope"] = "access"
    token_expiry_minutes = 30
    sub["exp"] = time.time() + 60 * token_expiry_minutes
    access_token = jwt.encode(sub, JWT_SECRET, algorithm=ALGORITHM)
    return access_token


async def create_refresh_token(user: User):
    """
    create refresh token for user
    :param user: user
    :return: refresh token
    """
    user_obj = await UserPydantic.from_tortoise_orm(user)
    sub = user_obj.dict()
    sub["scope"] = "refresh"
    token_expiry_days = 30
    sub["exp"] = time.time() + 86400 * token_expiry_days
    refresh_token = jwt.encode(sub, JWT_SECRET, algorithm=ALGORITHM)
    refresh_token_db = await RefreshToken.get_or_none(user=user)
    if refresh_token_db is None:
        refresh_token_db = await RefreshToken.create(user=user, token=refresh_token)
        await refresh_token_db.save()
    else:
        refresh_token_db.token = refresh_token
        await refresh_token_db.save()
    return refresh_token


async def refresh_tokens(token: str):
    """
    create new refresh_tokens
    :param token: user's refresh token
    :return: new tokens if refresh token is valid
    """
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=ALGORITHM)
        if payload.get("scope") != "refresh":
            raise jwt.exceptions.InvalidTokenError
        user = await User.get(username=payload.get("username"))
        refresh_token_db = await RefreshToken.get_or_none(user=user)
        if refresh_token_db is None or refresh_token_db.token != token:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token"
            )
        return await create_tokens(user)
    except jwt.exceptions.ExpiredSignatureError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Token expired"
        ) from exc
    except jwt.exceptions.DecodeError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username of password",
        ) from exc
    except jwt.exceptions.InvalidTokenError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token"
        ) from exc


class TokenResponse(BaseModel):
    """
    Token response model
    """

    access_token: str = "access_token"
    refresh_token: str = "refresh_token"
    token_type: str = "bearer"
