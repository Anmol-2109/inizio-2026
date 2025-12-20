from django.urls import path
from .views import (
    UpcomingEventsView, PastEventsView, EventDetailView,
    RegisterTeamView, TeamDetailView, AcceptInviteRedirectView,RemoveTeamMemberView,
    AcceptTeamMemberView,AddTeamMemberView,LeaveTeamView,AdminEventListCreateView,
    AdminEventSoftDeleteView,AdminEventUpdateView,NotificationListView,NotificationReadView,SaveDeviceTokenView
)

urlpatterns = [
    path("upcoming/", UpcomingEventsView.as_view()),
    path("past/", PastEventsView.as_view()),
    path("<int:id>/", EventDetailView.as_view()),

    path("<int:event_id>/register/", RegisterTeamView.as_view()),

    path("team/<int:id>/", TeamDetailView.as_view()),

    path("invite/<str:token>/", AcceptInviteRedirectView.as_view()),

    path("teams/<int:team_id>/accept/", AcceptTeamMemberView.as_view()),

    path("teams/<int:team_id>/add-member/", AddTeamMemberView.as_view()),

    path("teams/<int:team_id>/remove-member/<int:member_id>/",
         RemoveTeamMemberView.as_view()),

    path("teams/<int:team_id>/leave/", LeaveTeamView.as_view()),

    path("admin/", AdminEventListCreateView.as_view(), name="admin-events"),
    path("admin/<int:id>/", AdminEventUpdateView.as_view(), name="admin-event-update"),
    path("admin/<int:id>/delete/", AdminEventSoftDeleteView.as_view(), name="admin-event-delete"),

    path("notifications/", NotificationListView.as_view()),
    path("notifications/<int:pk>/read/", NotificationReadView.as_view()),
    path("save-device-token/", SaveDeviceTokenView.as_view()),

]

