from fastapi import WebSocket, HTTPException, status

from models.chat import Chat, ChatMessage, MessageResponse
from models.user import User


async def send_message(
    text: str, chat_id: int, user: User, reply_to: int = None
) -> ChatMessage:
    """
    Create message in db
    :param text: of message
    :param user: who sent
    :param chat_id: id
    :param reply_to: id of message to reply else None
    """
    chat = await Chat.get(id=chat_id)
    reply_message = await ChatMessage.get_or_none(id=reply_to)
    if reply_message is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Reply message not found")
    message = await ChatMessage.create(
        user=user,
        chat=chat,
        text=text,
        reply_to=reply_message,
    )
    return message


async def send_message_to_connection(
    chat_id: int,
    msg: MessageResponse,
    owner: User,
    connections: dict[int, set[(WebSocket, User | None)]],
):
    for conn, user in connections[chat_id]:
        if conn.client_state != 3:
            final_msg = msg.model_copy()
            final_msg.user = (
                None
                if (
                    (user is None and msg.user.id != owner.id)
                    or msg.user not in (owner.id, user.id)
                )
                else msg.user
            )
            await conn.send_json(final_msg.model_dump())
