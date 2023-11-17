

from fastapi import APIRouter, WebSocket


chat_router = APIRouter()


@chat_router.websocket("/ws/{chat_id}")
async def websocket_endpoint(websocket: WebSocket, chat_id: int):
    await websocket.accept()
    while True:
        data = await websocket.receive_text()
        await websocket.send_text(f"Message text: {data}")


