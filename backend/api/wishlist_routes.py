"""
Module containing API routes and handlers
"""


from fastapi import APIRouter, Depends, UploadFile, Form, File

from models.wishlist import WishlistItemResponse, WishlistResponse
from auth.services import get_current_user
from models.user import UserPydantic
from typing import Annotated
from pydantic import AnyHttpUrl
from api.wishlist_services import create_item, fetch_wishlist
from config import settings


api_router = APIRouter()


@api_router.post("/add_item", response_model=WishlistItemResponse, tags=["wishlist"])
async def add_item(
        title: Annotated[str, Form()],
        description: Annotated[str, Form()],
        link: Annotated[AnyHttpUrl, Form()],
        user: UserPydantic = Depends(get_current_user),
        image: UploadFile = File(None)
):
    return await create_item(
        title=title,
        description=description,
        link=link,
        user=user,
        image=image,
    )


@api_router.get("/get_wishlist", response_model=WishlistResponse, tags=["wishlist"])
async def get_item(
        user: UserPydantic = Depends(get_current_user)
):
    return await fetch_wishlist(user)


# @router.get("/get_item/{item_id}", response_model=item_response, tags=["item"])
# async def get_item_via_id(item_id: int):
#     """
#     Get item via id
#
#     :param item_id: id of item to get
#     :return: item if exists  or error
#     """
#     item = await Item.get_or_none(id=item_id)
#     if item is None:
#         raise HTTPException(status_code=404, detail="Item not found")
#     return item
#
#
# @router.put("/update_item/{item_id}", response_model=item_response, tags=["item"])
# async def update_item(item_id: int, item_update: item_create):
#     """
#     update item with id item_id with item_update info
#
#     :param item_id: id of item to update
#     :param item_update: item info
#     :return: item if updated or error
#     """
#     item = await Item.get_or_none(id=item_id)
#     if item is None:
#         raise HTTPException(status_code=404, detail="Item doesn't exist")
#
#     for field, value in item_update.dict().items():
#         setattr(item, field, value)
#     await item.save()
#
#     return item
#
#
# @router.delete("/delete/{item_id}", response_model=item_response, tags=["item"])
# async def delete_item(item_id: int):
#     """
#     Delete item with id item_id
#     :param item_id: id of item to delete
#     :return: deleted item if existed or error
#     """
#     item = await Item.get_or_none(id=item_id)
#     if item is None:
#         raise HTTPException(status_code=404, detail="Item not found")
#
#     await Item.delete(item)
#     return item
