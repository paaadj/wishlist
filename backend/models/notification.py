import datetime

from tortoise import Model, fields


class Notification(Model):
    id = fields.IntField(pk=True)
    user = fields.ForeignKeyField(
        "models.User",
        on_delete=fields.CASCADE,
        related_name="notifications"
    )
    read = fields.BooleanField(default=False)
    type = fields.CharField(max_length=255)

    data = fields.JSONField(null=True)

    class Meta:
        table = "notifications"


class DeferredNotifications(Model):
    id = fields.IntField(pk=True)
    user = fields.ForeignKeyField(
        "models.User",
        on_delete=fields.CASCADE,
        related_name="deferred_notifications"
    )
    type = fields.CharField(max_length=255)

    data = fields.JSONField(null=True)

    date_to_notify = fields.DateField()

    class Meta:
        table = "deferred_notifications"

    @classmethod
    async def check_notifications(cls):
        now = datetime.datetime.now()
        notifications = await cls.filter(date_to_notify__lt=now).prefetch_related("user")
        for notification in notifications:
            await Notification.create(user=notification.user, type=notification.type, data=notification.data)
            await notification.delete()
