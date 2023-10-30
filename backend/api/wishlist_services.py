
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
        if image:
            if image.content_type not in settings.ALLOWED_CONTENT_TYPES:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Not allowed content type")
            content = await image.read()
            if len(content) > settings.IMAGE_MAX_SIZE:
                raise HTTPException(status_code=413, detail="File too large")
            new_filename = str(uuid.uuid4())
            storage.child(new_filename).put(content, content_type=f"{image.content_type}")
            new_item.image_filename = new_filename
            new_item.image_url = storage.child(new_filename).get_url(None)
        await new_item.save()
        if new_item.image_url is None:
            new_item.image_url = settings.DEFAULT_IMAGE_URL
        return new_item.__dict__
    except Exception as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST) from exc


async def fetch_wishlist(
    user: UserPydantic
):
    wishlist = await user.wishlist
    items = await wishlist.items
    wishlist_items_response = []
    for item in items:
        if item.image_url is None:
            item.image_url = settings.DEFAULT_IMAGE_URL
        wishlist_items_response.append(WishlistItemResponse(**item.__dict__))
    return {"items": wishlist_items_response}
