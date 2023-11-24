import json
from typing import Dict
from fastapi import APIRouter, WebSocket, HTTPException, status, Depends
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
        #user: User = Depends(get_current_user),
):
    chat = await Chat.exists(id=chat_id)
    if chat is None:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Wrong chat")
    await websocket.accept()
    if chat_id not in connections:
        connections[chat_id] = set()
    user = await User.get(id=1)
    websocket.current_user = user
    connections[chat_id].add(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            text = json.loads(data)["text"]
            reply_to = json.loads(data)["reply_to"]
            user = websocket.current_user
            message = await send_message(text=text, chat_id=chat_id, user=user)
            for conn in connections[chat_id]:
                if conn.client_state != 3:  # Check if connection is still open
                    await conn.send_text(message.__dict__.__str__())
    except Exception as exc:
        print(exc)
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"{exc}")
