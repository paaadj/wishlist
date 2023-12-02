"""
Module containing API routes and handlers
"""
import datetime

from fastapi import APIRouter, Depends, UploadFile, Form, File, HTTPException, status
from models.wishlist import WishlistItemResponse, WishlistResponse
from auth.services import get_current_user
from auth.services import get_user_by_username
from models.user import UserResponse, User
from typing import Annotated, Optional
from pydantic import AnyHttpUrl
from api.wishlist_services import (
    create_item,
    fetch_wishlist,
    fetch_item,
    edit_item,
    remove_item,
    reserve,
    cancel_reservation,
)


api_router = APIRouter()


@api_router.post("/add_item", response_model=WishlistItemResponse, tags=["wishlist"])
async def add_item(
    title: Annotated[str, Form()],
    description: Annotated[str, Form()],
    link: Annotated[AnyHttpUrl, Form()] = None,
    user: User = Depends(get_current_user),
    image: UploadFile = File(None),
):
    return await create_item(
        title=title,
        description=description,
        link=link,
        user=user,
        image=image,
    )


@api_router.get("/get_wishlist", response_model=WishlistResponse, tags=["wishlist"])
async def get_wishlist(
    page: int = 1,
    per_page: int = 3,
    user: User = Depends(get_user_by_username),
):
    """
    Get wishlist item on page
    :param page: starts with 1
    :param per_page: count of items per page
    :param user:
    :return: list of items on page, current page, per_page value, total_items, total_pages
    """
    if page < 1:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Page out of range"
        )
    if per_page < 1:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="per_page must be > 0"
        )
    return await fetch_wishlist(page=page - 1, per_page=per_page, user=user)


@api_router.get("/get_item", response_model=WishlistItemResponse, tags=["wishlist"])
async def get_item_via_id(item_id: int):
    """
    Get item via id

    :param item_id: id of item to get
    :return: item if exists  or error
    """
    return await fetch_item(item_id)


@api_router.put("/update_item", response_model=WishlistItemResponse, tags=["wishlist"])
async def update_item(
    item_id: int,
    title: Annotated[str, Form()] = None,
    description: Annotated[str, Form()] = None,
    link: Annotated[AnyHttpUrl, Form()] = None,
    user: UserResponse = Depends(get_current_user),
    image: UploadFile = File(None),
):
    """
    Update user info
    """
    return await edit_item(
        item_id=item_id,
        title=title,
        description=description,
        link=link,
        user=user,
        image=image,
    )


@api_router.delete(
    "/delete/{item_id}", response_model=WishlistItemResponse, tags=["wishlist"]
)
async def delete_item(item_id: int, user=Depends(get_current_user)):
    """
    Delete item with item_id
    require access token in header
    return item if deleted, HTTP 400 if item_id < 1 and 401 if unauthorized
    """
    return await remove_item(item_id, user)


@api_router.post("/reserve", response_model=WishlistItemResponse, tags=["wishlist"])
async def reserve_item(item_id: int, date: datetime.datetime = None, user=Depends(get_current_user)):
    return await reserve(item_id, user, date)


@api_router.post("/unreserve", response_model=WishlistItemResponse, tags=["wishlist"])
async def cancel_reservation_item(item_id: int, user=Depends(get_current_user)):
    return await cancel_reservation(item_id, user)
