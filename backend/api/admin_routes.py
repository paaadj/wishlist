import math

from fastapi import (
    APIRouter, HTTPException, status, Depends, UploadFile, Form,
    File, Query
)
from models.user import UserCreate, User, UserResponseAdmin, UsersListAdminResponse
from models.wishlist import Wishlist
from models.wishlist_items import WishlistItem, WishlistItemAdminResponse
from auth.services import (
    create_user, get_current_admin, get_current_user,
    upload_image as upload_user_image, authenticate_user,
    delete_image as delete_user_image,
)
from api.wishlist_services import upload_image as upload_item_image, remove_image as delete_item_image
from auth.routes import check_username, check_email
from typing import Annotated
from pydantic import EmailStr, AnyHttpUrl
from passlib.hash import bcrypt
from tortoise.exceptions import ValidationError
from tortoise.expressions import Q
from datetime import datetime


router = APIRouter(prefix="/admin")


@router.post("/create_admin", response_model=UserResponseAdmin, tags=["admin"])
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


@router.get("/users", response_model=UsersListAdminResponse, tags=["admin"])
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
    total_users = await User.all().count()
    total_pages = math.ceil(total_users / per_page)
    users_response = [user.to_admin_response() for user in users]
    response = {
        "users": users_response,
        "per_page": per_page,
        "page": page,
        "total_items": total_users,
        "total_pages": total_pages,
    }
    return response


@router.put("/users/{user_username}/edit", response_model=UserResponseAdmin, tags=["admin"])
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
            user.image_url = await upload_user_image(
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


@router.get("/users/{user_username}/remove_image", response_model=UserResponseAdmin, tags=["admin"])
async def remove_user_image(
        user_username: str,
        admin: User = Depends(get_current_admin),
):
    user = await User.get_or_none(username=user_username)
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    if user.image_url:
        await delete_user_image(user.image_url)
        user.image_url = None
    await user.save()
    return user.to_admin_response()


@router.delete("/users/delete", response_model=UserResponseAdmin, tags=["admin"])
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


@router.post("/wishlists", response_model=list[WishlistItemAdminResponse], tags=["admin"])
async def get_wishlist_items(
        page: int = 1,
        per_page: int = 10,
        username: str = None,
        title: str = None,
        description: str = None,
        reserved_user: bool = None,
        admin: User = Depends(get_current_admin)
):
    try:
        query = WishlistItem.all()
        user_wishlist = None
        if username is not None:
            user = await User.get_or_none(username=username).prefetch_related("wishlist")
            if user is None:
                return []
            user_wishlist = user.wishlist

        if username:
            query = query.filter(wishlist_id=user_wishlist.id)
        if title:
            query = query.filter(title__icontains=title)
        if description:
            query = query.filter(description__icontains=description)
        if reserved_user:
            query = query.filter(~Q(reserved_user=None))
        items = await query.offset((page - 1)*per_page).limit(per_page).prefetch_related("wishlist__user")
        response = [await item.to_admin_response() for item in items]
        return response
    except ValidationError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"{exc}")


@router.put("/wishlists/{item_id}/edit", response_model=WishlistItemAdminResponse, tags=["admin"])
async def edit_wishlist_item(
        item_id: int,
        title: Annotated[str, Form()] = None,
        description: Annotated[str, Form()] = None,
        link: Annotated[AnyHttpUrl, Form()] = None,
        image: UploadFile = File(None),
        admin: User = Depends(get_current_admin)
):
    if item_id < 1:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid format item_id must be > 0",
        )
    item = await WishlistItem.get_or_none(id=item_id).prefetch_related("wishlist__user")
    if item is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item not found")

    if title:
        item.title = title
    if description:
        item.description = description
    if link:
        item.link = link
    if image:
        image_url = await upload_item_image(image=image, filename=item.image_url)
        item.image_url = image_url

    await item.save()

    return await item.to_admin_response()


@router.get("/wishlists/{item_id}/remove_image", response_model=WishlistItemAdminResponse, tags=["admin"])
async def remove_item_image(
        item_id: int,
        admin: User = Depends(get_current_admin),
):
    item = await WishlistItem.get_or_none(id=item_id).prefetch_related("wishlist__user")
    if item is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item not found")
    if item.image_url:
        await delete_item_image(item.image_url)
        item.image_url = None
    await item.save()
    return await item.to_admin_response()


@router.delete("/wishlists/{item_id}/delete", response_model=WishlistItemAdminResponse, tags=["admin"])
async def delete_item(
        item_id: int,
        admin: User = Depends(get_current_admin),
):
    item = await WishlistItem.get_or_none(id=item_id).prefetch_related("wishlist__user")
    if item is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item not found")
    await item.delete()
    return await item.to_admin_response()
