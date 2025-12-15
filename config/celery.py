import os
from celery import Celery

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

app = Celery('config')
app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()



from celery.schedules import crontab

app.conf.beat_schedule = {
    'cleanup-expired-otps-every-day': {
        'task': 'accounts.tasks.cleanup_expired_otps',
        'schedule': crontab(minute='*/1'), 
    },
    'cleanup-expired-reset-tokens-every-minute': {
        'task': 'accounts.tasks.cleanup_reset_tokens',
        'schedule': crontab(minute='*/1'),
    },

    'expire-event-invites-every-hour': {
        'task': 'events.tasks.expire_old_invites',
        'schedule': crontab(minute=0),  # once every hour
    },

    'send-event-reminders-every-minute': {
        'task': 'events.tasks.send_event_push_reminders',
        'schedule': crontab(minute='*/1'),
    },
    
    'cleanup-old-read-notifications-monthly': {
        'task': 'events.tasks.cleanup_old_read_notifications',
        'schedule': crontab(hour=0, minute=0, day_of_month=1),  # Run at midnight on the 1st of every month
    },

}


def debug_task(self):
    print(f"Request: {self.request!r}")