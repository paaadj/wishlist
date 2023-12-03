
from fastapi import APIRouter, Depends, HTTPException, status
from auth.services import get_current_user
from models.notification import Notification, NotificationResponse

router = APIRouter()


@router.get("/my_notifications", response_model=list[NotificationResponse], tags=["notifications"])
async def get_my_notifications(user=Depends(get_current_user)):
    notifications: list[NotificationResponse] = []
    for notification in await Notification.filter(user=user):
        notifications.append(notification.to_response())
    return notifications


@router.get("/my_notifications/{notification_id}/read", response_model=NotificationResponse, tags=["notifications"])
async def read_notification(notification_id: int, user=Depends(get_current_user)):
    notification: Notification | None = await Notification.get_or_none(id=notification_id)
    if notification is None or notification.user_id != user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Notification doesn't exists")
    notification.read = True
    await notification.save()
    return notification
