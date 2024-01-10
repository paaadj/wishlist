import datetime

from tortoise import Model, fields
from pydantic import BaseModel


class NotificationResponse(BaseModel):
    id: int
    read: bool
    type: str
    data: dict
    date: str


class Notification(Model):
    """
    Notifications model
    """

    id = fields.IntField(pk=True)
    user = fields.ForeignKeyField(
        "models.User", on_delete=fields.CASCADE, related_name="notifications"
    )
    read = fields.BooleanField(default=False)
    type = fields.CharField(max_length=255)

    data = fields.JSONField(null=True)
    date = fields.DatetimeField()

    class Meta:
        table = "notifications"

    def to_response(self) -> NotificationResponse:
        return NotificationResponse(
            id=self.id,
            read=self.read,
            type=self.type,
            data=self.data,
            date=self.date.__str__(),
        )


class DeferredNotifications(Model):
    """
    Deferred notifications model
    """

    id = fields.IntField(pk=True)
    user = fields.ForeignKeyField(
        "models.User", on_delete=fields.CASCADE, related_name="deferred_notifications"
    )
    type = fields.CharField(max_length=255)

    data = fields.JSONField(null=True)

    date_to_notify = fields.DatetimeField()

    class Meta:
        table = "deferred_notifications"
