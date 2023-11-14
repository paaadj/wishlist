"""
Module for token creation
"""
import datetime
import time

import jwt
from fastapi import HTTPException, status
from pydantic import BaseModel

from config import settings
from models.user import RefreshToken, User, UserResponse, UserJWT

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
    await refresh_token.save()
    return {
        "access_token": access_token,
        "refresh_token": refresh_token.token,
        "token_type": "bearer",
    }


async def create_access_token(user: User):
    """
    create access token for user
    :param user: user
    :return: access token
    """
    user_obj = UserJWT(**user.__dict__)
    sub = user_obj.model_dump()
    sub["scope"] = "access"
    sub["exp"] = time.time() + settings.JWT_ACCESS_TOKEN_EXPIRATION
    access_token = jwt.encode(sub, JWT_SECRET, algorithm=ALGORITHM)
    return access_token


async def create_refresh_token(user: User) -> RefreshToken:
    """
    create refresh token for user
    :param user: user
    :return: refresh token
    """
    user_obj = UserJWT(**user.__dict__)
    sub = user_obj.model_dump()
    expires_at = time.time() + settings.JWT_REFRESH_TOKEN_EXPIRATION
    sub["scope"] = "refresh"
    sub["exp"] = expires_at
    refresh_token = jwt.encode(sub, JWT_SECRET, algorithm=ALGORITHM)
    refresh_token = RefreshToken(
        user=user,
        token=refresh_token,
        expires_at=datetime.datetime.fromtimestamp(expires_at)
    )
    return refresh_token


async def clear_refresh_tokens(token: str):
    try:
        refresh_token = await RefreshToken.get_or_none(token=token)
        if refresh_token is None:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Token doesn't exist")
        user = await refresh_token.user
        await refresh_token.filter(user=user).delete()
        return True
    except Exception as exc:
        return False


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
        refresh_token_db = await RefreshToken.get_or_none(user=user, token=token)
        if refresh_token_db is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token"
            )
        access_token = await create_access_token(user)
        refresh_token = await create_refresh_token(user)
        refresh_token_db.token = refresh_token.token
        refresh_token_db.expires_at = refresh_token.expires_at
        await refresh_token_db.save()
        return {
            "access_token": access_token,
            "refresh_token": refresh_token.token,
            "token_type": "bearer",
        }
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
