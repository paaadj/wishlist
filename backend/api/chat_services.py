from models.chat import Chat, ChatMessage
from models.user import User
from tortoise.exceptions import ValidationError
from fastapi import HTTPException, status
from models.chat import MessageResponse


async def send_message(text: str, chat_id: int, user: User, reply_to=None) -> ChatMessage:
    chat = await Chat.get(id=chat_id)
    reply_message = await ChatMessage.get_or_none(id=reply_to)
    message = await ChatMessage.create(
        user=user,
        chat=chat,
        text=text,
        reply_to=reply_message,
    )
    return message


async def send_message_to_connection(chat_id: int, msg: MessageResponse, owner: User, connections: dict):
    for conn, user in connections[chat_id]:
        if conn.client_state != 3:
            final_msg = msg.model_copy()
            final_msg.user = None \
                if ((user is None and msg.user != owner.id)
                    or (msg.user != owner.id and msg.user != user.id)) \
                else msg.user
            await conn.send_text(final_msg.__dict__.__str__())
