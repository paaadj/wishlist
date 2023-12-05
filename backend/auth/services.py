"""
Module containing handlers for retrieving a user using an access token.
"""
import uuid

import jwt
from fastapi import Depends, HTTPException, status, UploadFile, WebSocket, Request
from fastapi.security import OAuth2PasswordBearer
from tortoise.exceptions import ValidationError, DoesNotExist
from tortoise.expressions import Q
from config import settings
from firebase_config import storage
from models.user import User, UserCreate
from passlib.hash import bcrypt
from models.wishlist import Wishlist

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token", auto_error=False)
JWT_SECRET = settings.SECRET_KEY
ALGORITHM = "HS256"


async def authenticate_user(username: str, password: str):
    """
    Get user if exists
    :param username: user's username
    :param password: user's password
    :return: user if exists
    """
    try:
        user = await User.get_or_none(username=username)
        if user is None:
            return False
        if not user.verify_password(password):
            return False
        return user
    except ValidationError as validation_error:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Invalid format, {validation_error}")


async def get_current_user(access_token: str = Depends(oauth2_scheme)):
    """
    get user via access token
    :param access_token: user's access token
    :return: user if access token is valid
    """
    try:
        if access_token is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")
        payload = jwt.decode(access_token, JWT_SECRET, algorithms=[ALGORITHM])
        if payload.get("scope") != "access":
            raise jwt.exceptions.InvalidSignatureError
        user = await User.get(id=payload.get("id"))
    except jwt.exceptions.DecodeError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_UNAUTHORIZED,
            detail="Invalid token format or signature",
        ) from exc
    except jwt.exceptions.ExpiredSignatureError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Token expired"
        ) from exc
    except DoesNotExist as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail=f"User doesn't exists") from exc
    return user


async def get_current_user_or_none(access_token: str = Depends(oauth2_scheme)) -> User | None:
    return None if access_token is None else await get_current_user(access_token)


async def create_user(user: UserCreate):
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
            raise ValidationError(
                f"password: Length of '{user.password}' {len(user.password)} < 8"
            )
        user_obj = User(**user.model_dump())
        user_obj.password = bcrypt.hash(user.password)
        await user_obj.save()
        await Wishlist.create(user=user_obj)
        return user_obj
    except ValidationError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=f"Invalid format: {exc}"
        ) from exc


async def upload_image(image: UploadFile, filename: str = None):
    if image.content_type not in settings.ALLOWED_CONTENT_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Not allowed content type"
        )
    content = await image.read()
    if len(content) > settings.IMAGE_MAX_SIZE:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail="File too large",
        )
    if not filename:
        filename = "user_images/" + str(uuid.uuid4())
    storage.child(filename).put(
        content, content_type=image.content_type
    )
    return filename


async def delete_image(filename):
    storage.delete(filename, token=None)


async def get_user_by_username(username: str):
    try:
        user = await User.get_or_none(username=username)
        if user is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="User doesn't exists"
            )
        return user
    except ValidationError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=f"Invalid format: {exc}"
        ) from exc
