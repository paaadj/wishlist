import re

from fastapi import UploadFile, File, Form
from tortoise.models import Model
from tortoise.validators import RegexValidator
from tortoise import fields
from pydantic import BaseModel, constr, AnyHttpUrl
from models.user import User
from typing import Annotated


class Wishlist(Model):
    id = fields.IntField(pk=True)
    user = fields.OneToOneField("models.User", related_name="wishlist", on_delete=fields.CASCADE)

    class Meta:
        table = 'wishlists'


class WishlistItem(Model):
    id = fields.IntField(pk=True)
    wishlist = fields.ForeignKeyField("models.Wishlist", related_name='items', on_delete=fields.CASCADE)
    title = fields.CharField(max_length=255)
    description = fields.CharField(max_length=255)
    link = fields.CharField(
        max_length=2048,
        null=True,
        validators=[
            RegexValidator(
                r"^https?://(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,63}\."
                r"[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&/=/]*)$",
                re.I
            )
        ],
    )
    image_filename = fields.CharField(max_length=2048, null=True)


class WishlistItemResponse(BaseModel):
    """
    Wishlist item response model
    """
    title: str = "Item"
    description: str = "Description example"
    link: AnyHttpUrl
    image_url: AnyHttpUrl


class Chat(Model):
    id = fields.IntField(pk=True)
    wishlist_item = fields.OneToOneField("models.WishlistItem", related_name='chat', on_delete=fields.CASCADE)


class ChatMessage(Model):
    id = fields.IntField(pk=True)
    user = fields.ForeignKeyField("models.User", related_name='messages', on_delete=fields.SET_NULL, null=True)
    chat = fields.ForeignKeyField("models.Chat", related_name='messages', on_delete=fields.CASCADE)
    text = fields.CharField(max_length=255)
    timestamp = fields.DatetimeField(auto_now=True)
