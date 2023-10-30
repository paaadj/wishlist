"""
Module containing routes and handlers for auth
"""


from fastapi import APIRouter, Depends, Header, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from passlib.hash import bcrypt
from tortoise.exceptions import ValidationError
from tortoise.expressions import Q

from config import settings
from models.user import User, UserPydantic, UserCreate
from models.wishlist import Wishlist

from .services import authenticate_user, get_current_user
from .token import (
    TokenResponse,
    refresh_tokens,
    create_tokens,
)

auth_router = APIRouter()
JWT_SECRET = settings.SECRET_KEY


@auth_router.post("/token", tags=["auth"], response_model=TokenResponse)
async def get_token(form_data: OAuth2PasswordRequestForm = Depends()):
    """
    Authenticate user
    :param form_data: username and password
    :return: access and refresh tokens and token type
    """
    user = await authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password",
        )

    return await create_tokens(user)


@auth_router.post("/refresh_token", tags=["auth"], response_model=TokenResponse)
async def get_new_tokens(token: str = Header(...)):
    """
    Refresh tokens
    :param token: refresh token
    :return: new access and refresh tokens
    """
    return await refresh_tokens(token)


@auth_router.post("/register", response_model=UserPydantic, tags=["auth"])
async def create_user(user: UserCreate):
    """
    Create new user

    :param user: user info for create
    :return: new user if created or error
    """
    try:
        if user.email:
            q = Q(username=user.username) | Q(email=user.email)
        else:
            q = Q(username=user.username)
        existing_user = await User.filter(q).first()

        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User with this username or email already exists",
            )
        if len(user.password) < 8:
            raise ValidationError(f"password: Length of '{user.password}' {len(user.password)} < 8")
        user_obj = User(**user.model_dump())
        user_obj.password = bcrypt.hash(user.password)
        await user_obj.save()
        await Wishlist.create(user=user_obj)
        return user_obj
    except ValidationError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=f"Invalid format: {exc}"
        ) from exc


@auth_router.get("/users/me", response_model=UserPydantic, tags=["auth"])
async def get_user(user: UserPydantic = Depends(get_current_user)):
    """
    get user
    :param user: user
    :return: user
    """
    return user


@auth_router.get("/users/username/{username}", response_model=bool)
async def check_username(username: str):
    """
    Check availability of username
    :param username: username to check
    :return: True if username is available else False
    """
    user = await User.filter(username=username).first()
    return not bool(user)


@auth_router.get("/users/email/{email}", response_model=bool)
async def check_email(email: str):
    """
    Check availability of email
    :param email: email to check
    :return: True if email is available else False
    """
    user = await User.filter(email=email).first()
    return not bool(user)
