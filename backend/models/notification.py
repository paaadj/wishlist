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
