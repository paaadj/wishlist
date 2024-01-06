import json
import math

from fastapi import HTTPException, UploadFile, Form, File, status

from models.wishlist import Wishlist, WishlistResponse
from models.wishlist_items import WishlistItem, WishlistItemResponse
from models.chat import Chat
from models.user import User
from models.user import UserResponse
from models.notification import Notification, DeferredNotifications
from tortoise.expressions import Q
from typing import Annotated, Optional
from pydantic import AnyHttpUrl
from config import settings
from firebase_config import storage
from datetime import datetime
import uuid


async def upload_image(
    image: UploadFile,
    filename: str = None,
):
    if image.content_type not in settings.ALLOWED_CONTENT_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Not allowed content type"
        )
    content = await image.read()
    if len(content) > settings.IMAGE_MAX_SIZE:
        raise HTTPException(status_code=413, detail="File too large")
    if not filename:
        filename = "item_images/" + str(uuid.uuid4())
    storage.child(filename).put(
        content, content_type=image.content_type
    )
    return filename


async def remove_image(filename: str):
    storage.delete(filename, token=None)


async def create_item(
    title: Annotated[str, Form()],
    description: Annotated[str, Form()],
    user: User,
    link: Annotated[AnyHttpUrl, Form()] = None,
    image: UploadFile = File(None),
) -> WishlistItem:
    """
    create item in user's wishlist
    require access token
    """
    try:
        new_item = WishlistItem(
            title=title,
            description=description,
            link=link,
        )
        new_item.wishlist = await user.wishlist
        if image:
            new_item.image_url = await upload_image(image=image)
        await new_item.save()
        await Chat.create(wishlist_item=new_item)
        return new_item
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=f"{exc}"
        ) from exc


async def fetch_wishlist(page: int, per_page: int, wishlist_owner: User, user: User | None):
    """
    fetch user's wishlist
    Return WishlistResponse in dict format
    """
    wishlist = await wishlist_owner.wishlist

    items: list[WishlistItemResponse] = []

    for item in await wishlist.items.limit(per_page).offset(page * per_page):
        items.append(item.to_response(user=user))

    total_items = await wishlist.items.all().count()
    total_pages = math.ceil(total_items / per_page)
    return {
        "items": items,
        "page": page + 1,
        "per_page": per_page,
        "total_items": total_items,
        "total_pages": total_pages,
    }


async def fetch_item(item_id: int) -> WishlistItem:
    """
    Fetch item by id
    """
    if item_id is None or item_id < 1:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="item_id must be > 0"
        )
    item = await WishlistItem.get_or_none(id=item_id).prefetch_related("reserved_user")
    if item is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Item not found"
        )
    return item


async def fetch_item_in_wishlist(item_id: int, wishlist: Wishlist) -> WishlistItem:
    """
    Fetch item by id and wishlist
    """
    item = await WishlistItem.get_or_none(
        id=item_id, wishlist=wishlist
    ).prefetch_related("reserved_user")
    if item is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Item not found"
        )
    return item


async def edit_item(
    item_id: int,
    title: Annotated[str, Form()],
    description: Annotated[str, Form()],
    link: Annotated[AnyHttpUrl, Form()],
    user: UserResponse,
    image: UploadFile = File(None),
) -> WishlistItem:
    """
    Update item info by item_id
    Return item if updated, HTTP 404 if item doesn't exists, 400 if wrong item_id
    """
    if item_id < 1:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid format item_id must be > 0",
        )
    wishlist = await user.wishlist
    item = await fetch_item_in_wishlist(item_id, wishlist)
    if title:
        item.title = title
    if description:
        item.description = description
    if link:
        item.link = link
    if image:
        image_url = await upload_image(image=image, filename=item.image_url)
        item.image_url = image_url

    await item.save()

    return item


async def remove_item_image(item_id: int, user: User) -> WishlistItem:
    wishlist = await user.wishlist
    item = await fetch_item_in_wishlist(item_id=item_id, wishlist=wishlist)
    if item.image_url is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Item with id {item_id} have no image"
        )
    await remove_image(item.image_url)
    item.image_url = None
    await item.save()
    return item


async def remove_item(item_id: int, user: User) -> WishlistItem:
    """
    Remove item by item_id
    require access token in header
    return item if deleted, HTTP 400 if item_id < 1 and 401 if unauthorized
    """
    if item_id < 1:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid format: item_id must be > 0",
        )
    wishlist = await user.wishlist
    item = await fetch_item_in_wishlist(item_id, wishlist)
    if item.image_url:
        await remove_image(item.image_url)
    await WishlistItem.delete(item)
    return item


async def create_reminder(
        item_id: int,
        user: User,
        date_to_remind: datetime,
):
    """
    Create deferred notification about reservation
    """
    data = {
        "item_id": item_id
    }
    new_date = datetime(date_to_remind.year, date_to_remind.month, date_to_remind.day, date_to_remind.hour)
    await DeferredNotifications.create(
        user=user,
        type="reserve reminder",
        data=data,
        date_to_notify=new_date,
    )


async def reserve(
    item_id: int,
    user: User,
    date_to_remind: datetime = None,
) -> WishlistItem:
    """
    Reserve item.
    item_id: int - id of item to reserve
    user who reserve
    date_to_remind - Optional. Date when need to remind
    """
    item: WishlistItem = await fetch_item(item_id)
    if item.reserved_user:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Item already reserved"
        )
    if item.wishlist == await user.wishlist:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Can't reserve your own item"
        )
    item.reserved_user = user
    await item.save()
    if date_to_remind:
        await create_reminder(item_id, user, date_to_remind)
    return item


async def cancel_reservation(
    item_id: int,
    user: User,
) -> WishlistItem:
    """
    Cancel item reservation.
    item_id: int - id of reserved item
    user who reserved. Needs to be sure that this is the right user
    """
    item = await fetch_item(item_id)
    if item.reserved_user != user:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="You didn't reserve this item"
        )
    item.reserved_user = None
    data = json.dumps({
        "item_id": item_id
    })
    reservation = await DeferredNotifications.filter(data__contains=data, type="reserve reminder").first()
    if reservation is not None:
        await reservation.delete()
    await item.save()
    return item
