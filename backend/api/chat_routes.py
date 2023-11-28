import json
from typing import Dict, Annotated
from fastapi import APIRouter, WebSocket, HTTPException, status, Depends, Query, WebSocketDisconnect, WebSocketException
from auth.services import get_current_user
from models.chat import Chat, ChatMessage, MessageResponse
from models.user import User, UserResponse
from api.chat_services import send_message


chat_router = APIRouter()


connections: Dict[int, set] = {}


@chat_router.websocket("/chats/{chat_id}/ws")
async def chat_endpoint(
        websocket: WebSocket,
        chat_id: int,
        token=Annotated[str | None, Query()],
):
    await websocket.accept()

    chat = await Chat.exists(id=chat_id)
    if not chat:
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
            await send_message_to_connection(chat_id=chat_id, msg=message, reply_to=reply_to)
    except KeyError as exc:
        await websocket.send_text(f"Unsupported data. INFO: {exc}")
    except WebSocketDisconnect as exc:
        connections[chat_id].remove(websocket)
        raise WebSocketException(code=status.WS_1000_NORMAL_CLOSURE, reason="Unknown error") from exc


async def send_message_to_connection(chat_id: int, msg: ChatMessage, reply_to: int | None):
    user_response = UserResponse(**msg.user.__dict__)
    msg_dict = msg.__dict__
    msg_dict["reply_to"] = reply_to
    msg_dict["user"] = user_response
    response = MessageResponse(**msg_dict)
    for conn in connections[chat_id]:
        if conn.client_state != 3:
            await conn.send_text(response.model_dump_json())



