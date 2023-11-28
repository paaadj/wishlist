from models.chat import Chat, ChatMessage
from models.user import User
from tortoise.exceptions import ValidationError
from fastapi import HTTPException, status


async def send_message(text: str, chat_id: int, user: User, reply_to=None) -> ChatMessage:
    chat = await Chat.get(id=chat_id)
    reply_message = await ChatMessage.get_or_none(id=reply_to)
    message = await ChatMessage.create(
        user=user,
        chat=chat,
        text=text,
        reply_to=reply_message,
    )
    print(message.__dict__)
    return message

