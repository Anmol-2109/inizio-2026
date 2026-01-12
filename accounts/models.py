from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone

from django.contrib.auth.models import BaseUserManager, AbstractUser
from django.db import models

from django.contrib.auth.hashers import make_password, check_password


class UserManager(BaseUserManager):
    def create_user(self, email, password=None, full_name="", **extra_fields):
        if not email:
            raise ValueError("Email is required")

        email = self.normalize_email(email)
        user = self.model(email=email, full_name=full_name, **extra_fields)

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)

        return self.create_user(email, password, **extra_fields)


class User(AbstractUser):
    username = None
    email = models.EmailField(unique=True)
    full_name = models.CharField(max_length=25, blank=True)
    is_profile_complete = models.BooleanField(default=False) 

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    objects = UserManager()

    def __str__(self):
        return self.email


class Profile(models.Model):
    # 1. Define the Options
    class DepartmentChoices(models.TextChoices):
        CSE = 'CSE', 'Computer Science & Engineering'
        ECE = 'ECE', 'Electronics & Communication Engineering'
        MATH = 'Mathematics', 'Mathematics'

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    
    # 2. Use 'choices=' to enforce selection
    department = models.CharField(
        max_length=50, 
        choices=DepartmentChoices.choices, 
        default=DepartmentChoices.CSE
    )

    college_name = models.CharField(
        max_length=255,
        null=False,
        blank=False,
        default='unknown college'
    )
    
    year = models.CharField(max_length=50, blank=True)
    phone = models.CharField(max_length=10, blank=True)

    def __str__(self):
        return f"{self.user.email}'s profile"

class EmailOTP(models.Model):
    PURPOSE_CHOICES = (
        ('register', 'Register'),
        ('reset_password', 'Reset Password'),
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='otps')
    code = models.CharField(max_length=128)  # hashed OTP
    purpose = models.CharField(max_length=20, choices=PURPOSE_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)
    is_used = models.BooleanField(default=False)
    expires_at = models.DateTimeField()

    def is_valid(self):
        return (not self.is_used) and (timezone.now() < self.expires_at)

    def __str__(self):
        return f"{self.user.email} - {self.purpose} - {self.code}"
    
    def verify(self, raw_code):
        return check_password(raw_code, self.code)
    

class ResetPasswordToken(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    token = models.CharField(max_length=100, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    used = models.BooleanField(default=False)

    def is_valid(self):
        return (not self.used) and (timezone.now() < self.expires_at)

    def __str__(self):
        return f"{self.user.email} - {self.token}"
