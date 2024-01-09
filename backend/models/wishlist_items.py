import enum

from pydantic import BaseModel, AnyHttpUrl
from typing import Optional
from tortoise import fields, Model
from tortoise.validators import RegexValidator
from models.user import User, UserResponseAdmin
import re


class ReservationStatusEnum(int, enum.Enum):
    NOT_RESERVED = 0
    RESERVED = 1
    RESERVED_BY_CURRENT_USER = 2


class WishlistItemResponse(BaseModel):
    """
    Wishlist item response model
    """

    id: int
    title: str
    description: str
    link: Optional[AnyHttpUrl] = None
    image_url: Optional[str] = None
    reserved_user: ReservationStatusEnum


class WishlistItemAdminResponse(BaseModel):
    id: int
    title: str
    description: str
    link: Optional[AnyHttpUrl] = None
    image_url: Optional[str] = None
    reserved_user: Optional[UserResponseAdmin] = None


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

    def to_response(self, user: User | None) -> WishlistItemResponse:
        reserved_user_response = ReservationStatusEnum.NOT_RESERVED
        if user is not None and self.reserved_user_id == user.id:
            reserved_user_response = ReservationStatusEnum.RESERVED_BY_CURRENT_USER
        elif self.reserved_user_id:
            reserved_user_response = ReservationStatusEnum.RESERVED

        return WishlistItemResponse(
            id=self.id,
            title=self.title,
            description=self.description,
            link=self.link,
            image_url=self.image_url,
            reserved_user=reserved_user_response,
        )

    async def to_admin_response(self) -> WishlistItemAdminResponse:
        user: User = await self.reserved_user
        reserved_user = None
        if user is not None:
            reserved_user = user.to_admin_response()
        item = WishlistItemAdminResponse(
            id=self.id,
            title=self.title,
            description=self.description,
            link=self.link,
            image_url=self.image_url,
            reserved_user=reserved_user,
        )
        return item

