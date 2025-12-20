from rest_framework import serializers
from django.utils import timezone
from django.db import transaction
from datetime import timedelta
from django.conf import settings

from .models import Event, EventTeam, EventTeamMember, EventInviteToken , DeviceToken ,Notification
from accounts.models import User

from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated, AllowAny

class EventCardSerializer(serializers.ModelSerializer):
    is_registered = serializers.SerializerMethodField()

    class Meta:
        model = Event
        fields = [
            "id", "name", "slug", "intro", "location",
            "start_time", "end_time",
            "min_team_size", "max_team_size",
            "is_registered"
        ]

    def get_is_registered(self, obj):
        """Check registration by email (works even if user signed up after being invited)"""
        request = self.context.get("request")
        if not request or not request.user.is_authenticated:
            return False
        
        user = request.user
        # Check by email to handle cases where user signed up after being invited
        return EventTeamMember.objects.filter(
            team__event=obj,
            email__iexact=user.email,
            status__in=["PENDING", "ACCEPTED"]
        ).exists()


class EventDetailSerializer(serializers.ModelSerializer):
    is_registered = serializers.SerializerMethodField()
    team_id = serializers.SerializerMethodField()

    class Meta:
        model = Event
        fields = "__all__"

    def get_is_registered(self, obj):
        return EventCardSerializer(obj, context=self.context).get_is_registered(obj)
    
    def get_team_id(self, obj):
        """Return the team ID if user is registered for this event (check by email)"""
        request = self.context.get("request")
        if not request or not request.user.is_authenticated:
            return None
        
        user = request.user
        # Check by email to handle cases where user signed up after being invited
        team_member = EventTeamMember.objects.filter(
            team__event=obj,
            email__iexact=user.email,
            status__in=["PENDING", "ACCEPTED"]
        ).first()
        
        if team_member:
            return team_member.team.id
        return None


class TeamMemberSerializer(serializers.ModelSerializer):
    is_current_user = serializers.SerializerMethodField()
    
    class Meta:
        model = EventTeamMember
        fields = ["id", "email", "is_leader", "status", "is_current_user"]
    
    def get_is_current_user(self, obj):
        """Check if this member is the current authenticated user (by email)"""
        request = self.context.get("request")
        if not request or not request.user.is_authenticated:
            return False
        user = request.user
        # Check by email to handle cases where user signed up after being invited
        return obj.email.lower() == user.email.lower()


class TeamDetailSerializer(serializers.ModelSerializer):
    members = TeamMemberSerializer(many=True)
    event = EventCardSerializer()

    class Meta:
        model = EventTeam
        fields = ["id", "team_name", "event", "members", "is_active"]


class RegisterTeamSerializer(serializers.Serializer):
    team_name = serializers.CharField()
    leader_email = serializers.EmailField()
    members = serializers.ListField(child=serializers.EmailField())

    def validate(self, attrs):
        request = self.context["request"]
        event = self.context["event"]

        leader = attrs["leader_email"].lower().strip()
        members = [m.lower().strip() for m in attrs["members"]]

        if leader not in members:
            raise serializers.ValidationError({"leader_email": "Leader must be in members list"})

        if request.user.email.lower() != leader:
            raise serializers.ValidationError({"leader_email": "Leader must be logged in user"})

        if len(members) < event.min_team_size:
            raise serializers.ValidationError({"members": "Team too small"})

        if len(members) > event.max_team_size:
            raise serializers.ValidationError({"members": "Team too large"})
        
        now = timezone.now()
        if not (event.registration_open <= now <= event.registration_close):
            raise serializers.ValidationError("Registration is closed for this event")

        # Check if any member is already in another team for this event (active membership only)
        for email in members:
            existing_member = EventTeamMember.objects.filter(
                team__event=event,
                email__iexact=email,
                status__in=["PENDING", "ACCEPTED"]
            ).first()
            
            if existing_member:
                raise serializers.ValidationError({
                    "members": f"{email} is already in another team ({existing_member.team.team_name}) for this event"
                })

        attrs["members"] = members
        attrs["event"] = event
        return attrs

    @transaction.atomic
    def create(self, validated_data):
        request = self.context["request"]
        event = validated_data["event"]
        team_name = validated_data["team_name"]
        members = validated_data["members"]
        leader_email = validated_data["leader_email"]

        team = EventTeam.objects.create(event=event, team_name=team_name, leader=request.user)

        for email in members:
            user = User.objects.filter(email=email).first()
            status = "ACCEPTED" if email == leader_email else "PENDING"

            member = EventTeamMember.objects.create(
                team=team, user=user, email=email,
                is_leader=email == leader_email, status=status
            )

            if status == "PENDING":
                token = EventInviteToken.objects.create(
                    member=member,
                    expires_at=timezone.now() + timedelta(days=3)
                )
                # Get frontend URL from settings, default to localhost:5173 if not set
                frontend_url = getattr(settings, 'FRONTEND_BASE_URL', 'http://localhost:5173')
                invite_url = f"{frontend_url}/events/invite/{token.token}"
                from .tasks import send_event_invite_email
                send_event_invite_email.delay(
                    email,
                    f"Join {team_name}",
                    f"Open to accept: {invite_url}"
                )
        
        # Refresh team active status after creating team and members
        team.refresh_is_active()
        
        return team


from rest_framework import serializers
from .models import Event

class EventAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = "__all__"  # Admin needs full access
        read_only_fields = ["created_by", "created_at"]

    def create(self, validated_data):
        request = self.context["request"]
        validated_data["created_by"] = request.user
        return super().create(validated_data)
    
    def validate(self, attrs):
        if attrs["start_time"] >= attrs["end_time"]:
            raise serializers.ValidationError("Event end time must be after start time")
        return attrs


from rest_framework import serializers
from .models import Notification, DeviceToken

class NotificationSerializer(serializers.ModelSerializer):
    event_id = serializers.IntegerField(source="event.id", read_only=True)
    
    class Meta:
        model = Notification
        fields = ["id", "message", "event", "event_id", "is_read", "created_at"]


class DeviceTokenSerializer(serializers.Serializer):
    token = serializers.CharField(max_length=255)