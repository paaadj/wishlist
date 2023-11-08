"""
Module containing routes and handlers for auth
"""


from fastapi import APIRouter, Depends, Header, HTTPException, status, UploadFile, File
from fastapi.security import OAuth2PasswordRequestForm

from config import settings
from models.user import User, UserResponse, UserCreate
from auth.services import authenticate_user, upload_image, delete_image, get_user_by_username
from tortoise.exceptions import ValidationError
from passlib.hash import bcrypt
from tortoise.expressions import Q
from typing import List, Optional
from pydantic import EmailStr

from .services import authenticate_user, get_current_user, create_user
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


@auth_router.post("/register", response_model=UserResponse, tags=["auth"])
async def register_user(user: UserCreate):
    """
    Create new user

    :param user: user info for create
    :return: new user if created or error
    """
    user = await create_user(user)
    return user.__dict__


@auth_router.post("/edit_info", response_model=UserResponse, tags=["auth"])
async def edit_info(
        email: Optional[EmailStr] = None,
        current_password: Optional[str] = None,
        new_password: Optional[str] = None,
        first_name: Optional[str] = None,
        last_name: Optional[str] = None,
        user: User = Depends(get_current_user),
        image: UploadFile = File(None)
):
    """
    Edit user info
    """
    try:
        if email:
            user.email = email
        if new_password:
            if not current_password or not await authenticate_user(user.username, current_password):
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Wrong password")
            user.password = bcrypt.hash(user.password)
        if first_name:
            user.first_name = first_name
        if last_name:
            user.last_name = last_name
        if image:
            user.image_filename, user.image_url = await upload_image(image, user.image_filename)
        elif user.image_filename:
            await delete_image(user.image_filename)
            user.image_filename = None
            user.image_url = None
        await user.save()
        return user.__dict__
    except ValidationError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Invalid format: {exc}")


@auth_router.get("/users/me", response_model=UserResponse, tags=["auth"])
async def get_user(user: UserResponse = Depends(get_current_user)):
    """
    get user
    :param user: user
    :return: user
    """
    return user.__dict__


@auth_router.get("/users/username/{username}", response_model=bool, tags=["auth"])
async def check_username(username: str):
    """
    Check availability of username
    :param username: to check
    :return: True if username is available else False
    """
    try:
        user = await User.filter(username=username).first()
        return not bool(user)
    except ValidationError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Invalid format: {exc}")


@auth_router.get("/users/email/{email}", response_model=bool, tags=["auth"])
async def check_email(email: str):
    """
    Check availability of email
    :param email: to check
    :return: True if email is available else False
    """
    try:
        user = await User.filter(email=email).first()
        return not bool(user)
    except ValidationError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Invalid format: {exc}")


@auth_router.get("/users", response_model=UserResponse, tags=["users"])
async def get_user(username: str):
    """
    Get user with username
    """
    user = await get_user_by_username(username)
    return user.__dict__


@auth_router.get("/users/like", response_model=list[UserResponse], tags=["users"])
async def get_users_with_username_like(username: str, per_page: int = 10, page: int = 1):
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
    users = await User.filter(username__contains=username).limit(per_page).offset((page - 1) * per_page)
    users = [UserResponse(**user.__dict__) for user in users]
    return users
