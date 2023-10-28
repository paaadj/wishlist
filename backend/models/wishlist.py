import re

from tortoise.models import Model
from tortoise.validators import RegexValidator
from tortoise import fields


class Wishlist(Model):
    id = fields.IntField(pk=True)
    user = fields.OneToOneField("models.User", on_delete=fields.CASCADE)

    class Meta:
        table = 'wishlists'


class WishlistItem(Model):
    id = fields.IntField(pk=True)
    wishlist = fields.ForeignKeyField("models.Wishlists", related_name='items', on_delete=fields.CASCADE)
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
    image_url = fields.CharField(max_length=2048, null=True)


class Chat(Model):
    id = fields.IntField(pk=True)
    wishlist_item = fields.OneToOneField("models.WishlistItem", related_name='chat', on_delete=fields.CASCADE)


class ChatMessage(Model):
    id = fields.IntField(pk=True)
    user = fields.ForeignKeyField("models.User", related_name='messages', on_delete=fields.SET_NULL)
    chat = fields.ForeignKeyField("models.Chat", related_name='messages', on_delete=fields.CASCADE)
    text = fields.CharField(max_length=255)
    timestamp = fields.DatetimeField(auto_now=True)
