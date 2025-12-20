import os
from celery import Celery
from celery.schedules import crontab

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

app = Celery('config')

app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()

# -------------------------
# CELERY BEAT SCHEDULE
# -------------------------
app.conf.beat_schedule = {

    # OTP cleanup every 10 minutes (NOT every minute)
    'cleanup-expired-otps': {
        'task': 'accounts.tasks.cleanup_expired_otps',
        'schedule': crontab(minute='*/10'),
    },

    # Reset tokens cleanup every 10 minutes
    'cleanup-expired-reset-tokens': {
        'task': 'accounts.tasks.cleanup_reset_tokens',
        'schedule': crontab(minute='*/10'),
    },

    # Event tasks (your logic preserved)
    'expire-event-invites-hourly': {
        'task': 'events.tasks.expire_old_invites',
        'schedule': crontab(minute=0),
    },

    'send-event-reminders': {
        'task': 'events.tasks.send_event_push_reminders',
        'schedule': crontab(minute='*/5'),
    },

    'cleanup-old-notifications-monthly': {
        'task': 'events.tasks.cleanup_old_read_notifications',
        'schedule': crontab(hour=0, minute=0, day_of_month=1),
    },
}

app.conf.timezone = 'Asia/Kolkata'
