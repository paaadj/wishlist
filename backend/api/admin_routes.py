from fastapi import (
    APIRouter, HTTPException, status, Depends, UploadFile, Form,
    File, Query
)
from models.user import UserCreate, User, UserResponseAdmin
from models.wishlist import Wishlist
from models.wishlist_items import WishlistItem
from auth.services import create_user, get_current_admin, get_current_user, upload_image, authenticate_user
from auth.routes import check_username, check_email
from typing import Annotated
from pydantic import EmailStr
from passlib.hash import bcrypt
from tortoise.exceptions import ValidationError
from datetime import datetime


router = APIRouter(prefix="/admin")


@router.post("/create_admin", response_model=UserResponseAdmin)
async def create_admin(
        user: UserCreate,
):
    users = await User.exists(is_admin=1)
    if users:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin already exists")
    user = await create_user(user)
    user.is_admin = True
    await user.save()
    return user.to_admin_response()


@router.get("/users", response_model=list[UserResponseAdmin])
async def get_users(
        admin: User = Depends(get_current_admin),
        page: int = Query(1, title="Number of page"),
        per_page: int = Query(10, title="limit users per page"),
        username: str = Query(None, title="Username filter"),
        email: EmailStr = Query(None, title="Email filter"),
        first_name: str = Query(None, title="First Name filter"),
        last_name: str = Query(None, title="Last name filter"),
        created_before: datetime = Query(None, title="Filter users created before the date"),
        created_after: datetime = Query(None, title="Filter users created after the date"),
        order_by: str = Query(None,
                              title="Sort users by field name(- for descending order) in format *field1,field2*"
                              )
):
    """

    """
    query = User.all()
    if username:
        query = query.filter(username__icontains=username)
    if email:
        query = query.filter(email__icontains=email)
    if first_name:
        query = query.filter(first_name__icontains=first_name)
    if last_name:
        query = query.filter(last_name__icontains=last_name)
    if created_before:
        query = query.filter(created_before__lte=created_before)
    if created_after:
        query = query.filter(created_after__gte=created_after)

    if order_by:
        order_fields = [field.strip() for field in order_by.split(',')]

        for field in order_fields:
            if not any(field.lower().strip("-") == attr.lower() for attr in User._meta.fields_map.keys()):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Invalid field in order_by: {field}",
                )

        query = query.order_by(*order_fields)

    users = await query.offset((page - 1) * per_page).limit(per_page)
    response = [user.to_admin_response() for user in users]
    return response


@router.post("/users/{user_username}/edit", response_model=UserResponseAdmin)
async def edit_user(
        user_username: str,
        username: Annotated[str, Form()] = None,
        email: Annotated[EmailStr, Form()] = None,
        new_password: Annotated[str, Form()] = None,
        first_name: Annotated[str, Form()] = None,
        last_name: Annotated[str, Form()] = None,
        image: UploadFile = File(None),
        is_admin: Annotated[bool, Form()] = None,
        admin: User = Depends(get_current_admin)
):
    try:
        user = await User.get_or_none(username=user_username)
        if user is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
        if username and email != user.username:
            if not await check_username(username):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"User with username {username} already exists"
                )
            user.username = username
        if email and email != user.email:
            if not await check_email(email):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"User with email {email} already exists"
                )
            user.email = email
        if new_password:
            user.password = bcrypt.hash(new_password)
        if first_name:
            user.first_name = first_name
        if last_name:
            user.last_name = last_name
        if image:
            user.image_url = await upload_image(
                image, user.image_url
            )
        if is_admin is not None:
            user.is_admin = is_admin
        await user.save()
        return user.to_admin_response()
    except ValidationError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=f"Invalid format: {exc}"
        )


@router.post("/users/delete", response_model=UserResponseAdmin)
async def delete_user(
        user_username: Annotated[str, Form()],
        admin: User = Depends(get_current_admin),
):
    try:
        user = await User.get_or_none(username=user_username)
        if user is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
        await user.delete()
        return user.to_admin_response()
    except ValidationError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"{exc}")


@router.post("/wishlists")
async def get_wishlist_items(
        page: int=1,
        per_page: int=10,
        username: str=None,
        title: str=None,
        description: str=None,
        reserved_user: bool = None,
):
    try:
        query = WishlistItem.all()
        if username is not None:
            user = await User.get_or_none(username=username).prefetch_related("wishlist")
            if user is None:
                return []
            user_wishlist = user.wishlist
            print(user_wishlist)
        return []
    except ValidationError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"{exc}")

# @router.get("/users/{user_username}/items")
# async def get_user_items(
#         user_username: str,
#         page=Query(1, title="Number of page"),
#         per_page=Query(10, title="Count of items per page"),
#         admin: User = Depends(get_current_admin),
# ):
#     user = await User.get_or_none(username=user_username)
#     if user is None:
#         raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
#
#
