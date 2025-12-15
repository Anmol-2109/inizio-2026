from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, EmailOTP, Profile


class CustomUserAdmin(UserAdmin):
    model = User
    list_display = ('email', 'full_name', 'is_active', 'is_profile_complete', 'is_staff')
    list_filter = ('is_active', 'is_profile_complete', 'is_staff')
    search_fields = ('email', 'full_name')
    ordering = ('email',)

    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal Info', {'fields': ('full_name',)}),
        ('Status', {'fields': ('is_active', 'is_profile_complete')}),
        ('Permissions', {'fields': ('is_staff', 'is_superuser', 'groups', 'user_permissions')}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'full_name', 'password1', 'password2', 'is_staff', 'is_superuser'),
        }),
    )


admin.site.register(User, CustomUserAdmin)


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'department', 'year', 'phone')
    search_fields = ('user__email', 'user__full_name')


@admin.register(EmailOTP)
class EmailOTPAdmin(admin.ModelAdmin):
    list_display = ('user', 'code', 'purpose', 'created_at', 'is_used', 'expires_at')
    list_filter = ('purpose', 'is_used')
    search_fields = ('user__email',)



from django.contrib import admin
from .models import ResetPasswordToken

@admin.register(ResetPasswordToken)
class ResetPasswordTokenAdmin(admin.ModelAdmin):
    list_display = ('user', 'token', 'used', 'created_at', 'expires_at')
    list_filter = ('used',)
    search_fields = ('user__email', 'token')
