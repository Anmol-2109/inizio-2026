from django.contrib import admin
from .models import Event, EventTeam, EventTeamMember, EventInviteToken, Notification, DeviceToken
from accounts.models import User
from .utils import notify_user
from .models import EventCustomField, EventSubmission



from django.contrib import admin
from .models import EventSubmission



# @admin.action(description="Export selected submissions to Google Sheets")
# def export_event_submissions(modeladmin, request, queryset):
#     sheet = get_google_sheet()

#     headers = [
#         "Event Name",
#         "Team Name",
#         "Leader Email",
#         "Team Members",
#         "Member Status",
#         "Submission Responses",
#         "Is Submitted",
#         "Submitted At",
#         "Created At",
#     ]

#     # Add header only once
#     if sheet.get_all_values() == []:
#         sheet.append_row(headers)

#     for submission in queryset:
#         team = submission.team
#         event = submission.event

#         leader_email = team.leader.email if team.leader else ""

#         members = team.members.all()
#         member_emails = ", ".join([m.email for m in members])
#         member_status = ", ".join([m.status for m in members])

#         responses = json.dumps(submission.responses, ensure_ascii=False)

#         row = [
#             event.name,
#             team.team_name or "",
#             leader_email,
#             member_emails,
#             member_status,
#             responses,
#             submission.is_submitted,
#             submission.submitted_at.strftime("%Y-%m-%d %H:%M") if submission.submitted_at else "",
#             submission.created_at.strftime("%Y-%m-%d %H:%M"),
#         ]

#         sheet.append_row(row)


# @admin.register(EventSubmission)
# class EventSubmissionAdmin(admin.ModelAdmin):
#     list_display = ("event", "team", "is_submitted", "submitted_at")
#     actions = [export_event_submissions]



from .models import EventInfoField

class EventInfoFieldInline(admin.TabularInline):
    model = EventInfoField
    extra = 3


@admin.register(EventInfoField)
class EventInfoFieldAdmin(admin.ModelAdmin):
    list_display = ("event", "label", "field_type", "key")
    list_filter = ("event", "field_type")
    search_fields = ("label", "key", "event__name")



@admin.register(EventCustomField)
class EventCustomFieldAdmin(admin.ModelAdmin):
    list_display = ("event", "label", "field_type", "required")
    list_filter = ("event", "field_type")


class EventCustomFieldInline(admin.TabularInline):
    model = EventCustomField
    extra = 3   # show 3 empty fields by default


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "start_time", "end_time", "is_active")
    search_fields = ("name", "slug")
    list_filter = ("is_active", "start_time", "end_time")
    ordering = ("start_time",)
    inlines = [EventCustomFieldInline,EventInfoFieldInline]
    
    def save_model(self, request, obj, form, change):
        """
        Override save_model to create notifications when event is created via admin.
        'change' is False for new objects, True for existing ones.
        """
        is_new = not change
        super().save_model(request, obj, form, change)
        
        # Only create notifications for newly created events
        if is_new:
            print(f"\n[ADMIN EVENT CREATED] Creating notifications for event: {obj.name}\n")
            
            # Set created_by if not set
            if not obj.created_by:
                obj.created_by = request.user
                obj.save()
            
            # In-app notifications to all active users
            users = User.objects.filter(is_active=True)
            user_count = users.count()
            print(f"[ADMIN EVENT CREATED] Creating notifications for {user_count} active users\n")
            
            if user_count == 0:
                print("[WARNING] No active users found - no notifications will be created\n")
            else:
                notification_count = 0
                for user in users:
                    try:
                        notify_user(user, f"New Event Announced: {obj.name}", event=obj)
                        notification_count += 1
                    except Exception as e:
                        print(f"[ERROR] Failed to create notification for {user.email}: {e}\n")
                print(f"[ADMIN EVENT CREATED] Successfully created {notification_count} notifications out of {user_count} users\n")
            
            # Push notification (FCM) - optional, won't break if FCM not configured
            try:
                from .firebase import send_push_notification
                tokens = list(DeviceToken.objects.values_list("token", flat=True))
                if tokens:
                    send_push_notification(
                        title="New Event Announced!",
                        body=f"{obj.name} is now live.",
                        tokens=tokens
                    )
                    print(f"[ADMIN EVENT CREATED] Sent push notification to {len(tokens)} devices\n")
                else:
                    print("[ADMIN EVENT CREATED] No device tokens found - skipping push notification\n")
            except Exception as e:
                print(f"[ADMIN EVENT CREATED] Push notification skipped (FCM may not be configured): {e}\n")

@admin.register(EventTeam)
class EventTeamAdmin(admin.ModelAdmin):
    list_display = ("id", "team_name", "event", "leader", "is_active")
    search_fields = ("team_name", "leader__email")
    list_filter = ("is_active", "event")
    ordering = ("-created_at",)

@admin.register(EventTeamMember)
class EventTeamMemberAdmin(admin.ModelAdmin):
    list_display = ("id", "team", "email", "is_leader", "status", "joined_at")
    search_fields = ("email", "team__team_name")
    list_filter = ("status", "is_leader")

@admin.register(EventInviteToken)
class EventInviteTokenAdmin(admin.ModelAdmin):
    list_display = ("token", "member", "used", "expires_at")
    list_filter = ("used",)
    search_fields = ("token", "member__email")

@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "message", "event", "is_read", "created_at")
    list_filter = ("is_read", "created_at", "event")
    search_fields = ("user__email", "message")
    readonly_fields = ("created_at",)
    ordering = ("-created_at",)

@admin.register(DeviceToken)
class DeviceTokenAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "token", "created_at")
    search_fields = ("user__email", "token")
    readonly_fields = ("created_at",)
    ordering = ("-created_at",)

from django.contrib import admin, messages
from .models import EventSubmission
from .utils import get_spreadsheet, safe_sheet_name


FIXED_HEADERS = [
    "Submission ID",
    "Team Name",
    "Leader Email",
    "Team Members",
    "Member Status",
    "Submitted At",
]


@admin.action(description="Export submissions (dynamic per event)")
def export_event_submissions(modeladmin, request, queryset):
    spreadsheet = get_spreadsheet()

    exported = 0
    skipped = 0

    for submission in queryset:
        event = submission.event
        team = submission.team
        responses = submission.responses or {}

        sheet_name = safe_sheet_name(event.name)

        # ---- get or create worksheet ----
        try:
            worksheet = spreadsheet.worksheet(sheet_name)
            headers = worksheet.row_values(1)
        except Exception:
            # 🔥 FIRST TIME FOR THIS EVENT
            dynamic_headers = list(responses.keys())
            headers = FIXED_HEADERS + dynamic_headers

            worksheet = spreadsheet.add_worksheet(
                title=sheet_name,
                rows="1000",
                cols=str(len(headers))
            )
            worksheet.append_row(headers)

        # ---- duplicate protection ----
        existing_ids = worksheet.col_values(1)
        if str(submission.id) in existing_ids:
            skipped += 1
            continue

        # ---- build row dynamically ----
        members = team.members.all()

        row = [
            submission.id,
            team.team_name or "",
            team.leader.email if team.leader else "",
            ", ".join(m.email for m in members),
            ", ".join(m.status for m in members),
            submission.submitted_at.strftime("%Y-%m-%d %H:%M")
            if submission.submitted_at else "",
        ]

        # 🔥 JSON → columns (order follows headers)
        for key in headers[len(FIXED_HEADERS):]:
            row.append(responses.get(key, ""))

        worksheet.append_row(row)
        exported += 1

    messages.success(
        request,
        f"Export complete: {exported} added, {skipped} skipped."
    )


@admin.register(EventSubmission)
class EventSubmissionAdmin(admin.ModelAdmin):
    list_display = ("id", "event", "team", "is_submitted")
    list_filter = ("event",)
    actions = [export_event_submissions]
