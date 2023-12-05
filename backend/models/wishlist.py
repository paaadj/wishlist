import re

from fastapi import UploadFile, File, Form
from tortoise.models import Model
from tortoise.validators import RegexValidator
from tortoise import fields
from pydantic import BaseModel, constr, AnyHttpUrl, field_validator, ValidationInfo
from models.user import User, UserResponse
from typing import List, Optional


class Wishlist(Model):
    id = fields.IntField(pk=True)
    user = fields.OneToOneField(
        "models.User", related_name="wishlist", on_delete=fields.CASCADE
    )

    class Meta:
        table = "wishlists"


class WishlistItem(Model):
    id = fields.IntField(pk=True)
    wishlist = fields.ForeignKeyField(
        "models.Wishlist", related_name="items", on_delete=fields.CASCADE
    )
    title = fields.CharField(max_length=255)
    description = fields.CharField(max_length=255)
    link = fields.CharField(
        max_length=2048,
        null=True,
        validators=[
            RegexValidator(
                r"^https?://(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,63}\."
                r"[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&/=/]*)$",
                re.I,
            )
        ],
    )
    image_url = fields.CharField(
        max_length=150,
        null=True,
    )
    reserved_user = fields.ForeignKeyField(
        "models.User",
        related_name="reserved_user",
        on_delete=fields.SET_NULL,
        null=True,
    )

    def __str__(self):
        print(self.title, self.image_url)


class WishlistItemResponse(BaseModel):
    """
    Wishlist item response model
    """

    id: int
    title: str
    description: str
    link: Optional[AnyHttpUrl] = None
    image_url: Optional[str] = None
    reserved_user: Optional[UserResponse] = None


class WishlistResponse(BaseModel):
    items: list[WishlistItemResponse]
    page: int
    per_page: int
    total_items: int
    total_pages: int



