"""
Module containing handlers for retrieving a user using an access token.
"""


import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from tortoise.exceptions import ValidationError
from tortoise.expressions import Q
from config import settings
from models.user import User, UserCreate
from passlib.hash import bcrypt
from models.wishlist import Wishlist

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
JWT_SECRET = settings.SECRET_KEY
ALGORITHM = "HS256"


async def authenticate_user(username: str, password: str):
    """
    Get user if exists
    :param username: user's username
    :param password: user's password
    :return: user if exists
    """
    user = await User.get_or_none(username=username)
    if user is None:
        return False
    if not user.verify_password(password):
        return False
    return user


async def get_current_user(access_token: str = Depends(oauth2_scheme)):
    """
    get user via access token
    :param access_token: user's access token
    :return: user if access token is valid
    """
    try:
        payload = jwt.decode(access_token, JWT_SECRET, algorithms=[ALGORITHM])
        if payload.get("scope") != "access":
            raise jwt.exceptions.DecodeError
        user = await User.get(username=payload.get("username"))
    except jwt.exceptions.DecodeError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token format or signature",
        ) from exc
    except jwt.exceptions.ExpiredSignatureError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Token expired"
        ) from exc
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password",
        ) from exc

    return user


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
