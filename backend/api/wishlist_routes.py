"""
Module containing API routes and handlers
"""


from fastapi import APIRouter, HTTPException, Depends, UploadFile, Form, File, status

from models.wishlist import Wishlist, WishlistItem, WishlistItemResponse
from models.user import User
from auth.services import get_current_user
from models.user import UserPydantic
from typing import Optional, Annotated
from pydantic import AnyHttpUrl
from config import settings, storage

import uuid

api_router = APIRouter()


@api_router.post("/add_item", response_model=WishlistItemResponse, tags=["wishlist"])
async def create_item(
        title: Annotated[str, Form()],
        description: Annotated[str, Form()],
        link: Annotated[AnyHttpUrl, Form()],
        user: UserPydantic = Depends(get_current_user),
        image: UploadFile = File(None)
):
    try:
        new_item = WishlistItem(
            title=title,
            description=description,
            link=link,
        )
        new_item.wishlist = await user.wishlist
        new_filename = "mqdefault.jpeg"
        if image:
            if image.content_type not in settings.ALLOWED_CONTENT_TYPES:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Not allowed content type")

            content = await image.read()
            new_filename = str(uuid.uuid4())
            storage.child(new_filename).put(content, content_type=f"{image.content_type}")
        new_item.image_filename = new_filename
        await new_item.save()
        return {**new_item.__dict__, "image_url": f"{storage.child(new_filename).get_url(None)}"}
    except Exception as exc:
        raise exc


# @router.get("/get_item", response_model=list[item_response], tags=["item"])
# async def get_item():
#     """
#     Get list of all items
#
#     :return: List of all items
#     """
#     items = await Item.all()
#     return items
#
#
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
