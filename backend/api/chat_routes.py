import json
from typing import Dict, Annotated
from fastapi import APIRouter, WebSocket, HTTPException, status, Depends, Query, WebSocketDisconnect, WebSocketException
from auth.services import get_current_user
from models.chat import Chat, ChatMessage, MessageResponse, ChatResponse
from models.user import User, UserResponse
from api.chat_services import send_message, send_message_to_connection
from json import JSONDecodeError


chat_router = APIRouter()


connections: Dict[int, set[(WebSocket, User | None)]] = {}


@chat_router.websocket("/chats/{chat_id}/ws")
async def chat_endpoint(
        websocket: WebSocket,
        chat_id: int
):
    await websocket.accept()

    chat = await Chat.get_or_none(id=chat_id).prefetch_related('wishlist_item__wishlist__user')

    if chat is None:
        await websocket.close(
            code=status.WS_1007_INVALID_FRAME_PAYLOAD_DATA,
            reason=f"Chat with id {chat_id} is not exists"
        )
        return

    owner = chat.wishlist_item.wishlist.user
    try:
        token = await websocket.receive_text()
    except WebSocketDisconnect:
        return
    user: User | None = None

    if token != "null":
        try:
            user = await get_current_user(token)
            await websocket.send_text("Success")
        except HTTPException as exc:
            await websocket.close(code=status.WS_1008_POLICY_VIOLATION, reason=f"Invalid token. INFO: {exc}")
            return

    connections.setdefault(chat_id, set()).add((websocket, user))

    try:
        while True:
            data = await websocket.receive_json()
            text = data["text"]
            reply_to = data.get("reply_to", None)
            message = await send_message(text=text, chat_id=chat_id, user=user, reply_to=reply_to)
            message = await message.to_response()
            await send_message_to_connection(chat_id=chat_id, msg=message, owner=owner, connections=connections)
    except KeyError as exc:
        await websocket.send_text(f"U127nsupported data. INFO: {exc}")
    except WebSocketDisconnect:
        connections[chat_id].remove((websocket, user))
        return
    except JSONDecodeError as exc:
        await websocket.send_text(f"Unsupported data. INFO: {exc}")


@chat_router.get("chats/{chat_id}", response_model=ChatResponse)
async def get_chat_messages(chat_id: int, user=Depends(get_current_user)):
    chat = await Chat.get_or_none(id=chat_id).prefetch_related('wishlist_item__wishlist__user')
    if chat is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Chat is not exists")
    owner: User = chat.wishlist_item.wishlist.user
    messages_data = []
    for message in await chat.messages:
        final_msg = await message.to_response()
        final_msg.user = None if (user.id != final_msg.user and final_msg.user != owner.id) else final_msg.user
        messages_data.append(final_msg)
    return {
        'id': chat.id,
        'wishlist_item': chat.wishlist_item.id,
        'messages': messages_data
    }
