from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.http import HttpResponseRedirect
from django.urls import reverse
from django.conf import settings
from rest_framework.views import APIView

from .models import EventTeam, EventTeamMember, EventInviteToken
from accounts.models import User
from .serializers import TeamDetailSerializer,DeviceTokenSerializer
from django.conf import settings
from datetime import timedelta
from django.utils import timezone
# import serializers



from .models import Event, EventTeam, EventTeamMember, EventInviteToken ,DeviceToken,Notification

from .serializers import (
    EventCardSerializer, EventDetailSerializer,
    RegisterTeamSerializer, TeamDetailSerializer,NotificationSerializer
)


class UpcomingEventsView(generics.ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = EventCardSerializer

    def get_queryset(self):
        return Event.objects.filter(end_time__gte=timezone.now(), is_active=True)


class PastEventsView(generics.ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = EventCardSerializer

    def get_queryset(self):
        return Event.objects.filter(end_time__lt=timezone.now(), is_active=True)


class EventDetailView(generics.RetrieveAPIView):
    queryset = Event.objects.all()
    serializer_class = EventDetailSerializer
    permission_classes = [AllowAny]
    lookup_field = "id"


class RegisterTeamView(generics.GenericAPIView):
    serializer_class = RegisterTeamSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, event_id):
        event = get_object_or_404(Event, id=event_id)
        serializer = self.get_serializer(
            data=request.data, context={"request": request, "event": event}
        )
        serializer.is_valid(raise_exception=True)
        team = serializer.save()
        return Response(
            TeamDetailSerializer(team, context={"request": request}).data,
            status=201
        )


class TeamDetailView(generics.RetrieveAPIView):
    queryset = EventTeam.objects.all()
    serializer_class = TeamDetailSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = "id"
    
    def get_object(self):
        """Check access by email (works even if user signed up after being invited)"""
        team = super().get_object()
        user = self.request.user
        
        # Check by email to handle cases where user signed up after being invited
        if not team.members.filter(email__iexact=user.email).exists():
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("You are not part of this team.")
        
        return team


class AcceptInviteRedirectView(generics.GenericAPIView):
    """
    Step 1: Invite link → hits this view
    If NOT logged in → force login → after login redirect here automatically
    """
    permission_classes = [AllowAny]

    def get(self, request, token):
        invite = EventInviteToken.objects.filter(token=token).first()
        if not invite or not invite.is_valid():
            return Response({"detail": "Invalid or expired invite"}, status=400)

        if not request.user.is_authenticated:
            login_url = f"{settings.FRONTEND_BASE_URL}/login?next=/invite/{token}"
            return HttpResponseRedirect(login_url)

        member = invite.member
        if request.user.email.lower() != member.email.lower():
            return Response({"detail": "Not your invite"}, status=403)

        member.user = request.user
        member.status = "ACCEPTED"
        member.save()

        invite.used = True
        invite.save()

        return HttpResponseRedirect(
            f"{settings.FRONTEND_BASE_URL}/team/{member.team.id}"
        )



class AcceptTeamMemberView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, team_id):
        team = get_object_or_404(EventTeam, id=team_id)
        # Check by email to handle users who signed up after being invited
        member = team.members.filter(email__iexact=request.user.email).first()

        if not member:
            return Response({"error": "Not a member of this team"}, status=403)

        if member.status == "ACCEPTED":
            return Response({"detail": "Already accepted"}, status=200)

        # Update status
        member.status = "ACCEPTED"
        member.save()

        # Refresh team active status (team might now meet minimum requirement)
        team.refresh_is_active()

        # Mark invite token used if exists
        if hasattr(member, "invite_token"):
            member.invite_token.used = True
            member.invite_token.save()

        return Response(
            TeamDetailSerializer(team, context={"request": request}).data
        )


class AddTeamMemberView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, team_id):
        team = get_object_or_404(EventTeam, id=team_id)

        # Only leader allowed (check by email to handle users who signed up after being invited)
        leader = team.members.filter(email__iexact=request.user.email, is_leader=True).first()
        if not leader:
            return Response({"error": "Only team leader can add members"}, status=403)

        email = request.data.get("email")
        if not email:
            return Response({"error": "Email required"}, status=400)

        email = email.lower().strip()

        # Check if member is already in another team for the same event (active membership)
        existing_member = EventTeamMember.objects.filter(
            team__event=team.event,
            email__iexact=email,
            status__in=["PENDING", "ACCEPTED"]
        ).exclude(team=team).first()
        
        if existing_member:
            return Response({
                "error": f"This member is already in another team ({existing_member.team.team_name}) for this event"
            }, status=400)

        # Check if member previously left this team - if so, reactivate them
        left_member = team.members.filter(email__iexact=email, status="LEFT").first()
        
        if left_member:
            # Reactivate the member who left
            user = User.objects.filter(email=email).first()
            left_member.status = "PENDING"
            left_member.user = user  # Update user in case they signed up after leaving
            left_member.save()
            new_member = left_member
        else:
            # Check if member already exists in this team with active status
            if team.members.filter(email__iexact=email).exclude(status="LEFT").exists():
                return Response({"error": "Member already in team"}, status=400)
            
            # Check team size limit (only count active members, exclude LEFT members)
            active_members_count = team.members.exclude(status="LEFT").count()
            if active_members_count >= team.event.max_team_size:
                return Response({"error": "Team is already full"}, status=400)

            # Create new member with PENDING status
            user = User.objects.filter(email=email).first()
            new_member = EventTeamMember.objects.create(
                team=team,
                email=email,
                user=user,
                is_leader=False,
                status="PENDING"
            )

        # Create or update invite token
        # If member was reactivated and has an old token, delete it first (OneToOne relationship)
        EventInviteToken.objects.filter(member=new_member).delete()
        invite = EventInviteToken.objects.create(
            member=new_member,
            expires_at=timezone.now() + timedelta(days=3)
        )

        # Send invite email async
        frontend_url = getattr(settings, 'FRONTEND_BASE_URL', 'http://localhost:5173')
        invite_url = f"{frontend_url}/events/invite/{invite.token}"
        from .tasks import send_event_invite_email
        send_event_invite_email.delay(email, "Team Invite", f"Join team → {invite_url}")

        # Refresh team active status (won't change since new member is PENDING, but good for consistency)
        team.refresh_is_active()

        return Response(
            TeamDetailSerializer(team, context={"request": request}).data,
            status=201
        )


class RemoveTeamMemberView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, team_id, member_id):
        team = get_object_or_404(EventTeam, id=team_id)
        # Check by email to handle users who signed up after being invited
        leader = team.members.filter(email__iexact=request.user.email, is_leader=True).first()

        if not leader:
            return Response({"error": "Only leader can remove members"}, status=403)

        member = get_object_or_404(EventTeamMember, id=member_id, team=team)

        if member.is_leader:
            return Response({"error": "Leader cannot remove themselves"}, status=400)

        # If pending → token must be invalidated
        if member.status == "PENDING" and hasattr(member, "invite_token"):
            member.invite_token.used = True
            member.invite_token.save()

        member.delete()
        team.refresh_is_active()

        return Response(
            TeamDetailSerializer(team, context={"request": request}).data
        )


class LeaveTeamView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, team_id):
        team = get_object_or_404(EventTeam, id=team_id)
        # Check by email to handle users who signed up after being invited
        member = team.members.filter(email__iexact=request.user.email).first()

        if not member:
            return Response({"error": "Not team member"}, status=403)

        if member.is_leader:
            return Response({"error": "Leader cannot leave the team"}, status=400)

        if member.status != "ACCEPTED":
            return Response({"error": "You can leave only after accepting"}, status=400)

        member.status = "LEFT"
        member.save()
        team.refresh_is_active()

        return Response({"detail": "You left the team"}, status=200)


from rest_framework import generics, status
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response

from .models import Event
from .serializers import EventAdminSerializer


class AdminEventListCreateView(generics.ListCreateAPIView):
    queryset = Event.objects.filter(is_active=True)
    serializer_class = EventAdminSerializer
    permission_classes = [IsAdminUser]

    def perform_create(self, serializer):
        event = serializer.save(created_by=self.request.user)

    # In-app notifications to all users
        from accounts.models import User
        from .utils import notify_user

        users = User.objects.filter(is_active=True)  # Only active users
        user_count = users.count()
        print(f"\n[EVENT CREATED] Creating notifications for {user_count} active users for event: {event.name}\n")
        
        if user_count == 0:
            print("[WARNING] No active users found - no notifications will be created\n")
        else:
            notification_count = 0
            for user in users:
                try:
                    notify_user(user, f"New Event Announced: {event.name}", event=event)
                    notification_count += 1
                except Exception as e:
                    print(f"[ERROR] Failed to create notification for {user.email}: {e}\n")
            print(f"[EVENT CREATED] Successfully created {notification_count} notifications out of {user_count} users\n")

    # Push notification
        from .firebase import send_push_notification
        from .models import DeviceToken

        tokens = list(DeviceToken.objects.values_list("token", flat=True))
        send_push_notification(
            title="New Event Announced!",
            body=f"{event.name} is now live.",
            tokens=tokens,
            event_id=event.id
        )




class AdminEventUpdateView(generics.RetrieveUpdateAPIView):
    queryset = Event.objects.filter(is_active=True)
    serializer_class = EventAdminSerializer
    permission_classes = [IsAdminUser]
    lookup_field = "id"


class AdminEventSoftDeleteView(generics.GenericAPIView):
    queryset = Event.objects.all()
    permission_classes = [IsAdminUser]
    lookup_field = "id"

    def delete(self, request, id):
        try:
            event = Event.objects.get(id=id)
        except Event.DoesNotExist:
            return Response({"detail": "Event not found"}, status=404)

        event.is_active = False
        event.save()
        return Response({"detail": "Event deleted (soft delete)"}, status=200)


from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import DeviceToken, Notification
from .serializers import DeviceTokenSerializer, NotificationSerializer


class SaveDeviceTokenView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = DeviceTokenSerializer

    def post(self, request):
        token = request.data.get("token")

        DeviceToken.objects.get_or_create(
            user=request.user,
            token=token
        )

        return Response({"message": "Device token saved"}, status=201)


class NotificationListView(generics.ListAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)


class NotificationReadView(generics.UpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = NotificationSerializer
    queryset = Notification.objects.all()

    def patch(self, request, *args, **kwargs):
        notif = self.get_object()
        if notif.user != request.user:
            return Response({"detail": "Not allowed"}, status=403)

        notif.is_read = True
        notif.save()

        return Response({"message": "Marked as read"})
