from django.db import models
from django.conf import settings
from django.utils import timezone
import uuid


class Event(models.Model):
    name = models.CharField(max_length=255)
    slug = models.SlugField(unique=True)

    intro = models.CharField(max_length=300, blank=True)
    description = models.TextField()
    location = models.CharField(max_length=255, blank=True)

    start_time = models.DateTimeField()
    end_time = models.DateTimeField()

    registration_open = models.DateTimeField(default=timezone.now)
    registration_close = models.DateTimeField(default=timezone.now)

    min_team_size = models.PositiveIntegerField(default=1)
    max_team_size = models.PositiveIntegerField(default=1)

    is_active = models.BooleanField(default=True)

    image = models.ImageField(
        upload_to="events/images/",
        null=True,
        blank=False,
    )

    # 📜 Required rules array
    rules = models.JSONField(
        null=False,
        blank=False,
        help_text="List of rules for the event",
        default='no rule found'
    )


    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL, null=True, related_name="created_events",
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["start_time"]

    def __str__(self):
        return self.name


class EventTeam(models.Model):
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name="teams")
    team_name = models.CharField(max_length=255,null=True, blank=True)
    leader = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="led_teams",
    )
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("event", "team_name")

    def __str__(self):
        return f"{self.team_name} ({self.event.name})"

    def refresh_is_active(self):
        accepted = self.members.filter(status="ACCEPTED").count()
        self.is_active = self.event.min_team_size <= accepted <= self.event.max_team_size
        self.save()


class EventTeamMember(models.Model):
    STATUS = (
        ("PENDING", "Pending"),
        ("ACCEPTED", "Accepted"),
        ("LEFT", "Left"),
    )

    team = models.ForeignKey(EventTeam, on_delete=models.CASCADE, related_name="members")
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
                             null=True, blank=True, related_name="event_memberships")
    email = models.EmailField()
    is_leader = models.BooleanField(default=False)
    status = models.CharField(max_length=10, choices=STATUS, default="PENDING")
    joined_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("team", "email")
        indexes = [
            models.Index(fields=["email"]),
            models.Index(fields=["status"]),
            models.Index(fields=["team"]),
        ]
    def __str__(self):
        return f"{self.email} - {self.team.team_name}"


class EventInviteToken(models.Model):
    member = models.OneToOneField(EventTeamMember, on_delete=models.CASCADE,
                                  related_name="invite_token")
    token = models.CharField(max_length=64, unique=True, default=uuid.uuid4)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    used = models.BooleanField(default=False)

    def is_valid(self):
        return (not self.used) and (self.expires_at > timezone.now())

    def __str__(self):
        return f"Invite({self.member.email})"


class DeviceToken(models.Model):
    """Stores FCM push tokens for each user."""
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="device_tokens"
    )
    token = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "token")

    def __str__(self):
        return f"{self.user.email} -> {self.token}"


class Notification(models.Model):
    """In-app notifications stored for every user."""
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="notifications"
    )
    event = models.ForeignKey(
        Event,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="notifications"
    )

    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["user", "is_read"]),
        ]

    def __str__(self):
        return f"Notify({self.user.email})"