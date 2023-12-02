import datetime

from tortoise import Model, fields


class Notification(Model):
    """
    Notifications model
    """
    id = fields.IntField(pk=True)
    user = fields.ForeignKeyField(
        "models.User",
        on_delete=fields.CASCADE,
        related_name="notifications"
    )
    read = fields.BooleanField(default=False)
    type = fields.CharField(max_length=255)

    data = fields.JSONField(null=True)
    info = fields.CharField(max_length=255)
    date = fields.DatetimeField()

    class Meta:
        table = "notifications"


class DeferredNotifications(Model):
    """
    Deferred notifications model
    """
    id = fields.IntField(pk=True)
    user = fields.ForeignKeyField(
        "models.User",
        on_delete=fields.CASCADE,
        related_name="deferred_notifications"
    )
    type = fields.CharField(max_length=255)

    data = fields.JSONField(null=True)

    date_to_notify = fields.DatetimeField()

    class Meta:
        table = "deferred_notifications"
