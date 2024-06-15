"""
Module containing routes and handlers for auth
"""


from typing import Annotated

from fastapi import (APIRouter, Depends, File, Form, Header, HTTPException,
                     UploadFile, status)
from fastapi.security import OAuth2PasswordRequestForm
from passlib.hash import bcrypt
from pydantic import EmailStr
from tortoise.exceptions import ValidationError

from auth.services import delete_image, get_user_by_username, upload_image
from config import settings
from models.user import User, UserCreate, UserResponse

from .services import authenticate_user, create_user, get_current_user
from .token import (TokenResponse, clear_refresh_tokens, create_tokens,
                    refresh_tokens)

auth_router = APIRouter()
JWT_SECRET = settings.SECRET_KEY


@auth_router.post("/token", tags=["auth"], response_model=TokenResponse)
async def get_token(form_data: OAuth2PasswordRequestForm = Depends()):
    """
    Authenticate user \n
    **form_data** Form with username and password fields \n
    **return** access and refresh tokens and token type
    """
    user = await authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password",
        )

    return await create_tokens(user)


@auth_router.post("/refresh_token",
                  tags=["auth"],
                  response_model=TokenResponse)
async def get_new_tokens(token: str = Header(...)):
    """
    Refresh tokens \n
    **token** existing refresh token \n
    **return** new access and new refresh tokens
    """
    return await refresh_tokens(token)


@auth_router.post("/reset_auth", tags=["auth"], response_model=bool)
async def reset_auth(token: str = Header(...)):
    """
    Reset auth on other devices \n
    **Require existing refresh_token in header**
    Delete all refresh tokens from db \n

    """
    return await clear_refresh_tokens(token)


@auth_router.post("/register", response_model=UserResponse, tags=["auth"])
async def register_user(user: UserCreate):
    """
    Create new user \n

    **user** user info for create \n
    **return** new user if created else error
    """
    user = await create_user(user)
    return user.__dict__


@auth_router.put("/edit_info", response_model=UserResponse, tags=["auth"])
async def edit_info(
    username: Annotated[str, Form()] = None,
    email: Annotated[EmailStr, Form()] = None,
    current_password: Annotated[str, Form()] = None,
    new_password: Annotated[str, Form()] = None,
    first_name: Annotated[str, Form()] = None,
    last_name: Annotated[str, Form()] = None,
    user: User = Depends(get_current_user),
    image: UploadFile = File(None),
):
    """
    Edit user info \n
    **All parameters are optional**
    """
    try:
        if username:
            if not await check_username(username):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"User with username {username} already exists",
                )
            user.username = username
        if email:
            if not await check_email(email):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"User with email {email} already exists",
                )
            user.email = email
        if new_password:
            if not current_password or not await authenticate_user(
                user.username, current_password
            ):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Wrong password")
            user.password = bcrypt.hash(new_password)
        if first_name:
            user.first_name = first_name
        if last_name:
            user.last_name = last_name
        if image:
            user.image_url = await upload_image(image, user.image_url)
        await user.save()
        return user.__dict__
    except ValidationError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid format: {exc}")


@auth_router.get("/delete_image", response_model=UserResponse, tags=["auth"])
async def remove_image(user: User = Depends(get_current_user)):
    if user.image_url is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"You have no image")
    await delete_image(user.image_url)
    user.image_url = None
    await user.save()
    return user


@auth_router.get("/users/me", response_model=UserResponse, tags=["auth"])
async def get_current_user(user: User = Depends(get_current_user)):
    """
    Get user by token \n
    **Require access_token in header** \n
    **return** user info
    """
    return user


@auth_router.get("/users/username/{username}",
                 response_model=bool, tags=["auth"])
async def check_username(username: str):
    """
    Check availability of username \n
    **username** to check \n
    **return** True if username is available else False
    """
    try:
        user = await User.filter(username=username).first()
        return not bool(user)
    except ValidationError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid format: {exc}")


@auth_router.get("/users/email/{email}", response_model=bool, tags=["auth"])
async def check_email(email: str):
    """
    Check availability of email \n
    **email** to check \n
    **return** True if email is available else False
    """
    try:
        user = await User.filter(email=email).first()
        return not bool(user)
    except ValidationError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid format: {exc}")


@auth_router.get("/users", response_model=UserResponse, tags=["users"])
async def get_user(username: str):
    """
    Get user with username
    """
    user = await get_user_by_username(username)
    return user.__dict__


@auth_router.get("/users/like",
                 response_model=list[UserResponse],
                 tags=["users"])
async def get_users_with_username_like(
    username: str, per_page: int = 10, page: int = 1
):
    """
    Get list of users with username like
    """
    if page < 1:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Page out of range"
        )
    if per_page < 1:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="limit must be > 0"
        )
    users = (
        await User.filter(username__contains=username)
        .limit(per_page)
        .offset((page - 1) * per_page)
    )
    users = [UserResponse(**user.__dict__) for user in users]
    return users
