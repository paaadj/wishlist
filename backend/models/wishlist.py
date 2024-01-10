from tortoise.models import Model
from tortoise import fields
from pydantic import BaseModel
from models.wishlist_items import WishlistItemResponse, WishlistItemAdminResponse


class Wishlist(Model):
    id = fields.IntField(pk=True)
    user = fields.OneToOneField(
        "models.User", related_name="wishlist", on_delete=fields.CASCADE
    )

    class Meta:
        table = "wishlists"


class WishlistResponse(BaseModel):
    items: list[WishlistItemResponse]
    page: int
    per_page: int
    total_items: int
    total_pages: int


class WishlistsAdminResponse(BaseModel):
    items: list[WishlistItemAdminResponse]
    page: int
    per_page: int
    total_items: int
    total_pages: int



