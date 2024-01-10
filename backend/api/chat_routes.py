from typing import Dict, Annotated
from fastapi import (
    APIRouter,
    WebSocket,
    HTTPException,
    status,
    Depends,
    WebSocketDisconnect,
    Form,
)
from auth.services import get_current_user, get_current_user_or_none
from models.chat import Chat, ChatMessage, MessageResponse, ChatResponse
from models.user import User
from api.chat_services import send_message, send_message_to_connection
from json import JSONDecodeError

router = APIRouter()

connections: Dict[int, set[(WebSocket, User | None)]] = {}


@router.websocket("/chats/{chat_id}/ws")
async def chat_endpoint(websocket: WebSocket, chat_id: int):
    await websocket.accept()

    chat = await Chat.get_or_none(id=chat_id).prefetch_related(
        "wishlist_item__wishlist__user"
    )

    if chat is None:
        await websocket.close(
            code=status.WS_1007_INVALID_FRAME_PAYLOAD_DATA,
            reason=f"Chat with id {chat_id} is not exists",
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
            await websocket.close(
                code=status.WS_1008_POLICY_VIOLATION,
                reason=f"Invalid token. INFO: {exc}",
            )
            return

    connections.setdefault(chat_id, set()).add((websocket, user))

    try:
        while True:
            data = await websocket.receive_json()
            text = data["text"]
            reply_to = data.get("reply_to", None)
            message = await send_message(
                text=text, chat_id=chat_id, user=user, reply_to=reply_to
            )
            message = await message.to_response()
            await send_message_to_connection(
                chat_id=chat_id, msg=message, owner=owner, connections=connections
            )
    except KeyError as exc:
        await websocket.send_text(f"Unsupported data. INFO: {exc}")
    except WebSocketDisconnect:
        connections[chat_id].remove((websocket, user))
        return
    except JSONDecodeError as exc:
        await websocket.send_text(f"Unsupported data. INFO: {exc}")


@router.get("/chats/{chat_id}", response_model=ChatResponse, tags=["chat"])
async def get_chat_messages(
    chat_id: int, user: User = Depends(get_current_user_or_none)
):
    """
    Get chat messages from chat with **chat_id(int)** \n
    **Require access token in header**
    """
    chat = await Chat.get_or_none(wishlist_item_id=chat_id).prefetch_related(
        "wishlist_item__wishlist__user"
    )
    if chat is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Chat is not exists"
        )
    owner: User = chat.wishlist_item.wishlist.user
    messages_data = []
    for msg in await chat.messages:
        final_msg = await msg.to_response()
        final_msg.user = (
            None
            if (
                (user is None and msg.user_id != owner.id)
                or (
                    user is not None
                    and msg.user_id != owner.id
                    and msg.user_id != user.id
                )
            )
            else final_msg.user
        )
        messages_data.append(final_msg)
    return {
        "id": chat.id,
        "wishlist_item": chat.wishlist_item.id,
        "messages": messages_data,
    }


@router.get(
    "/chats/{chat_id}/{chat_message}", response_model=MessageResponse, tags=["chat"]
)
async def get_chat_message(
    chat_id: int, chat_message: int, user: User = Depends(get_current_user_or_none)
):
    """
    Get chat message with **chat_message id (int)**
    """
    chat_message: ChatMessage | None = await ChatMessage.get_or_none(
        id=chat_message
    ).prefetch_related("chat__wishlist_item__wishlist__user")
    if chat_message is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Message doesn't exists"
        )
    owner: User = chat_message.chat.wishlist_item.wishlist.user
    final_msg: MessageResponse = await chat_message.to_response()
    final_msg.user = (
        None
        if (
            (user is None and chat_message.user_id != owner.id)
            or (
                user is not None
                and chat_message.user_id != owner.id
                and chat_message.user_id != user.id
            )
        )
        else final_msg.user
    )
    return final_msg


@router.put(
    "/chats/{chat_id}/{chat_message}/edit",
    response_model=MessageResponse,
    tags=["chat"],
)
async def edit_chat_message(
    chat_id: int,
    chat_message: int,
    message: Annotated[str, Form()],
    user=Depends(get_current_user),
):
    """
    Edit chat message with **chat_message id (int)** \n
    new text - **message(str)** \n
    **Require access token in header**
    """
    chat_message = await ChatMessage.get_or_none(id=chat_message)
    if chat_message is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Message doesn't exists"
        )
    if chat_message.user_id != user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Cant edit not yours message"
        )
    chat_message.text = message
    await chat_message.save()
    return await chat_message.to_response()
