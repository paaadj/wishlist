from models.wishlist import Chat, ChatMessage
from models.user import User
from tortoise.exceptions import ValidationError
from fastapi import HTTPException, status


async def send_message(text: str, chat_id: int, user: User):
    chat = await Chat.get(id=chat_id)
    message = await ChatMessage.create(
        user=user,
        chat=chat,
        text=text,
    )
    return message
