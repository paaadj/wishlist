"""
Module containing API routes and handlers
"""
import datetime

from fastapi import APIRouter, Depends, UploadFile, Form, File, HTTPException, status
from models.wishlist import WishlistItemResponse, WishlistResponse
from auth.services import get_current_user, get_current_user_or_none
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


router = APIRouter()


@router.post("/add_item", response_model=WishlistItemResponse, tags=["wishlist"])
async def add_item(
    title: Annotated[str, Form()],
    description: Annotated[str, Form()],
    link: Annotated[AnyHttpUrl, Form()] = None,
    user: User = Depends(get_current_user),
    image: UploadFile = File(None),
):
    """
    Add item to wishlist
    title: str in Form
    description: str in Form
    link (Optional) link to item in HttpUrl format
    image - Image file
    Require access token in header
    """
    item = await create_item(
        title=title,
        description=description,
        link=link,
        user=user,
        image=image,
    )
    return item.to_response(None)


@router.get("/get_wishlist", response_model=WishlistResponse, tags=["wishlist"])
async def get_wishlist(
    page: int = 1,
    per_page: int = 3,
    wishlist_owner: User = Depends(get_user_by_username),
    current_user: User | None = Depends(get_current_user_or_none),
):
    """
    Get wishlist item on page
    :param page: starts with 1
    :param per_page: count of items per page
    :param wishlist_owner:
    :param current_user: current user if access_token is not None
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
    return await fetch_wishlist(page=page - 1, per_page=per_page, wishlist_owner=wishlist_owner, user=current_user)


@router.get("/get_item", response_model=WishlistItemResponse, tags=["wishlist"])
async def get_item_via_id(item_id: int, user: User | None = Depends(get_current_user_or_none)):
    """
    Get item via id

    :param item_id: id of item to get
    :param user: user if access_token is not None
    :return: item if exists or error
    """
    item = await fetch_item(item_id=item_id)
    return item.to_response(user=user)


@router.put("/update_item", response_model=WishlistItemResponse, tags=["wishlist"])
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
    item = await edit_item(
        item_id=item_id,
        title=title,
        description=description,
        link=link,
        user=user,
        image=image,
    )
    return item.to_response(user=None)


@router.delete(
    "/delete/{item_id}", response_model=WishlistItemResponse, tags=["wishlist"]
)
async def delete_item(item_id: int, user=Depends(get_current_user)):
    """
    Delete item with item_id
    require access token in header
    return item if deleted, HTTP 400 if item_id < 1 and 401 if unauthorized
    """
    item = await remove_item(item_id, user)
    return item.to_response(user=None)


@router.post("/reserve", response_model=WishlistItemResponse, tags=["wishlist"])
async def reserve_item(item_id: int, date: datetime.datetime = None, user=Depends(get_current_user)):
    """
    Reserve item with item_id: int
    require access token in header
    date (Optional) - date to remind about reservation if need
    """
    item = await reserve(item_id, user, date)
    return item.to_response(user=user)


@router.post("/unreserve", response_model=WishlistItemResponse, tags=["wishlist"])
async def cancel_reservation_item(item_id: int, user=Depends(get_current_user)):
    """
    Cancel item reservation with item_id and user
    Require access token in header
    """
    item = await cancel_reservation(item_id, user)
    return item.to_response(user=user)
