import json
from typing import Dict, Annotated
from fastapi import APIRouter, WebSocket, HTTPException, status, Depends, Query
from fastapi.security import OAuth2PasswordBearer

from auth.services import get_current_user
from models.wishlist import Chat, ChatMessage
from models.user import User
from api.chat_services import send_message


chat_router = APIRouter()


connections: Dict[int, set] = {}


@chat_router.websocket("/chats/{chat_id}/ws")
async def websocket_endpoint(
        websocket: WebSocket,
        chat_id: int,
        token=Annotated[str | None, Query()],
):
    await websocket.accept()
    chat = await Chat.exists(id=chat_id)
    if not chat:
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION ,reason=f"Chat with id {chat_id} is not exists")
    if chat_id not in connections:
        connections[chat_id] = set()
    connections[chat_id].add(websocket)
    user: User = None
    if token:
        user = await get_current_user(token)
    try:
        while True:
            data = await websocket.receive_text()
            text = json.loads(data)["text"]
            reply_to = None
            try:
                reply_to = json.loads(data)["reply_to"]
            except KeyError:
                pass

            message = await send_message(text=text, chat_id=chat_id, user=user, reply_to=reply_to)
            for conn in connections[chat_id]:
                if conn.client_state != 3:
                    await conn.send_text(message.__dict__.__str__())
    except KeyError as exc:
        await websocket.close(code=status.WS_1003_UNSUPPORTED_DATA, reason=f"required {exc}, but nothing was received")
    except:
        await websocket.close(code=status.WS_1006_ABNORMAL_CLOSURE, reason="Unknown error")
