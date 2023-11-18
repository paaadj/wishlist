
from typing import Dict
from fastapi import APIRouter, WebSocket, HTTPException, status
from models.wishlist import Chat, ChatMessage



chat_router = APIRouter()


connections: Dict[str, set] = {}


@chat_router.websocket("/ws/{room_id}")
async def websocket_endpoint(websocket: WebSocket, room_id: str):
    chat = Chat.get_or_none(id=room_id)
    if chat is None:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Wrong chat")
    await websocket.accept()
    if room_id not in connections:
        connections[room_id] = set()
    connections[room_id].add(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            for conn in connections[room_id]:
                if conn.client_state != 3:  # Check if connection is still open
                    await conn.send_text(data)
    except Exception as exc:
        connections[room_id].remove(websocket)
