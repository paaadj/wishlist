from tortoise import Model, fields
from pydantic import BaseModel
from models.user import UserResponse
from datetime import datetime
from typing import Optional


class Chat(Model):
    id = fields.IntField(pk=True)
    wishlist_item = fields.OneToOneField(
        "models.WishlistItem", related_name="chat", on_delete=fields.CASCADE
    )


class ChatMessage(Model):
    id = fields.IntField(pk=True)
    user = fields.ForeignKeyField(
        "models.User", related_name="messages", on_delete=fields.SET_NULL, null=True
    )
    chat = fields.ForeignKeyField(
        "models.Chat", related_name="messages", on_delete=fields.CASCADE
    )
    text = fields.CharField(max_length=255)
    timestamp = fields.DatetimeField(auto_now=True)
    reply_to = fields.ForeignKeyField(
        "models.ChatMessage",
        related_name='replies',
        null=True,
        on_delete=fields.SET_NULL,
    )


class MessageResponse(BaseModel):
    id: int
    user: UserResponse
    text: str
    reply_to: Optional[int] = None
    timestamp: datetime


class ChatResponse(BaseModel):
    id: int
    item_id: int
    messages: list[MessageResponse]
