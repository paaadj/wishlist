import json
from typing import Dict, Annotated
from fastapi import APIRouter, WebSocket, HTTPException, status, Depends, Query, WebSocketDisconnect, WebSocketException
from auth.services import get_current_user
from models.chat import Chat, ChatMessage, MessageResponse, ChatResponse
from models.user import User, UserResponse
from api.chat_services import send_message
from json import JSONDecodeError


chat_router = APIRouter()


connections: Dict[int, set] = {}


@chat_router.websocket("/chats/{chat_id}/ws")
async def chat_endpoint(
        websocket: WebSocket,
        chat_id: int,
        token: Annotated[str | None, Query()] = None,
):
    await websocket.accept()

    chat = await Chat.get_or_none(id=chat_id).prefetch_related('wishlist_item')
    wishlist = await chat.wishlist_item.wishlist
    owner = await wishlist.user
    if chat is None:
        raise WebSocketException(
            code=status.WS_1007_INVALID_FRAME_PAYLOAD_DATA,
            reason=f"Chat with id {chat_id} is not exists"
        )

    user: User = None
    if token is not None:
        try:
            user = await get_current_user(token)
        except Exception:
            raise WebSocketException(code=status.WS_1008_POLICY_VIOLATION, reason="Invalid token")
    connections.setdefault(chat_id, set()).add(websocket)

    try:
        while True:
            data = await websocket.receive_text()
            payload = json.loads(data)
            text = payload["text"]
            reply_to = payload.get("reply_to", None)
            message: ChatMessage = await send_message(text=text, chat_id=chat_id, user=user, reply_to=reply_to)
            await send_message_to_connection(chat_id=chat_id, msg=message, owner=owner, recipient=user)
    except KeyError as exc:
        await websocket.send_text(f"Unsupported data. INFO: {exc}")
    except WebSocketDisconnect as exc:
        connections[chat_id].remove(websocket)
        raise WebSocketException(code=status.WS_1000_NORMAL_CLOSURE, reason="Unknown error") from exc
    except JSONDecodeError as exc:
        await websocket.send_text(f"Unsupported data. INFO: {exc}")


async def send_message_to_connection(chat_id: int, msg: ChatMessage, owner: User, recipient: User):
    for conn in connections[chat_id]:
        if conn.client_state != 3:
            await conn.send_text((await msg.to_response(owner=owner, recipient=recipient)).__dict__.__str__())


# TODO anonymous chat message response
# TODO determining who the user is, the owner of the message or wishlist
@chat_router.get("chats/{chat_id}", response_model=ChatResponse)
async def get_chat_messages(chat_id: int, user=Depends(get_current_user)):
    chat = await Chat.get_or_none(id=chat_id).prefetch_related('wishlist_item')
    if chat is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Chat is not exists")
    messages_data = []
    for message in await chat.messages:
        messages_data.append(await message.to_response())
    return {
        'id': chat.id,
        'wishlist_item': chat.wishlist_item.id,
        'messages': messages_data
    }
