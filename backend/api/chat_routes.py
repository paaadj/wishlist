import json
from typing import Dict
from fastapi import APIRouter, WebSocket, HTTPException, status, Depends
from fastapi.security import OAuth2PasswordBearer

from auth.services import get_current_user
from models.wishlist import Chat, ChatMessage
from models.user import User
from api.chat_services import send_message


chat_router = APIRouter()


connections: Dict[int, set] = {}


async def get_user_ws(websocket: WebSocket) -> User:
    token = websocket.headers.get('Authorization')
    if token is None:
        await websocket.close(reason="Unauthorized")
    return await get_current_user(token)


@chat_router.websocket("/chats/{chat_id}/ws")
async def websocket_endpoint(
        websocket: WebSocket,
        chat_id: int,
):
    await websocket.accept()
    chat = await Chat.exists(id=chat_id)
    if not chat:
        await websocket.close(reason=f"Chat with id {chat_id} is not exists")
    if chat_id not in connections:
        connections[chat_id] = set()
    user = await get_user_ws(websocket)
    websocket.current_user = user
    connections[chat_id].add(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            text = json.loads(data)["text"]
            reply_to = None
            try:
                reply_to = json.loads(data)["reply_to"]
            except KeyError:
                pass
            user = websocket.current_user
            message = await send_message(text=text, chat_id=chat_id, user=user, reply_to=reply_to)
            for conn in connections[chat_id]:
                if conn.client_state != 3:
                    await conn.send_text(message.__dict__.__str__())
    except Exception as exc:
        await websocket.close(reason=f"{exc}")
