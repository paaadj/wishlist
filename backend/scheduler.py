import datetime

from apscheduler.schedulers.asyncio import AsyncIOScheduler
from models.user import RefreshToken
from models.notification import Notification, DeferredNotifications


async def clear_refresh_tokens():
    now = datetime.datetime.now()
    await RefreshToken.filter(expires_at__lt=now).delete()


async def check_deferred_notifications():
    now = datetime.date.today()
    notifications = await DeferredNotifications.filter(date_to_notify__lt=now).prefetch_related("user")
    for notification in notifications:
        await Notification.create(user=notification.user, type=notification.type, data=notification.data)
        await notification.delete()

scheduler = AsyncIOScheduler()
scheduler.add_job(clear_refresh_tokens, 'cron', hour="00", minute="00")
scheduler.add_job(check_deferred_notifications, 'cron', minute="00")
