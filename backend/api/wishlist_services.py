import math

from fastapi import APIRouter, HTTPException, Depends, UploadFile, Form, File, status

from models.wishlist import Wishlist, WishlistItem, WishlistItemResponse
from models.user import User
from auth.services import get_current_user
from models.user import UserPydantic
from typing import Optional, Annotated
from pydantic import AnyHttpUrl
from config import settings
from firebase_config import storage
import uuid


async def upload_image(
        item: WishlistItem,
        image: UploadFile,
):
    if image.content_type not in settings.ALLOWED_CONTENT_TYPES:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Not allowed content type")
    content = await image.read()
    if len(content) > settings.IMAGE_MAX_SIZE:
        raise HTTPException(status_code=413, detail="File too large")
    new_filename = str(uuid.uuid4())
    storage.child(new_filename).put(content, content_type=image.content_type)
    item.image_filename = new_filename
    item.image_url = storage.child(new_filename).get_url(None)
    return item


async def update_image(
        item: WishlistItem,
        image: UploadFile,
):
    if image.content_type not in settings.ALLOWED_CONTENT_TYPES:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Not allowed content type")
    content = await image.read()
    if len(content) > settings.IMAGE_MAX_SIZE:
        raise HTTPException(status_code=413, detail="File too large")
    storage.child(item.image_filename).put(content, content_type=image.content_type)
    return item


async def remove_image(
        filename: str
):
    storage.delete(filename, token=None)


async def create_item(
        title: Annotated[str, Form()],
        description: Annotated[str, Form()],
        link: Annotated[AnyHttpUrl, Form()],
        user: UserPydantic,
        image: UploadFile = File(None)
):
    try:
        new_item = WishlistItem(
            title=title,
            description=description,
            link=link,
        )
        new_item.wishlist = await user.wishlist
        if image:
            new_item = await upload_image(item=new_item, image=image)
        await new_item.save()
        return new_item.__dict__
    except Exception as exc:
        print(exc)
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST) from exc


async def fetch_wishlist(
        page: int,
        per_page: int,
        user: UserPydantic
):
    wishlist = await user.wishlist
    items = await wishlist.items.limit(per_page).offset(page*per_page)
    total_items = await wishlist.items.all().count()
    total_pages = math.ceil(total_items / per_page)
    return {
        "items": items,
        "page": page + 1,
        "per_page": per_page,
        "total_items": total_items,
        "total_pages": total_pages
    }


async def fetch_item(
        item_id: int
):
    if item_id is None or item_id < 1:
        raise HTTPException(status_code=400, detail="item_id must be > 0")
    item = await WishlistItem.get_or_none(id=item_id)
    if item is None:
        raise HTTPException(status_code=404, detail="Item not found")
    if item.image_url is None:
        item.image_url = settings.DEFAULT_IMAGE_URL
    return item


async def edit_item(
        item_id: int,
        title: Annotated[str, Form()],
        description: Annotated[str, Form()],
        link: Annotated[AnyHttpUrl, Form()],
        user: UserPydantic,
        image: UploadFile = File(None),
):
    item = await WishlistItem.get_or_none(id=item_id)
    if item is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Item doesn't exist")
    if await item.wishlist != await user.wishlist:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)
    setattr(item, "title", title)
    setattr(item, "description", description)
    setattr(item, "link", link)
    if image:
        if item.image_filename:
            item = await update_image(item=item, image=image)
        else:
            item = await upload_image(item=item, image=image)
    elif item.image_filename:
        await remove_image(item.image_filename)
        item.image_filename = None
        item.image_url = None

    await item.save()

    return item


async def remove_item(
        item_id: int,
        user: User
):
    item = await WishlistItem.get_or_none(id=item_id)
    if item is None:
        raise HTTPException(status_code=404, detail="Item not found")
    if await item.wishlist != await user.wishlist:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Wrong user")
    if item.image_filename:
        await remove_image(item.image_filename)
    await WishlistItem.delete(item)

    return item

