from django.contrib.auth.models import AbstractUser
from django.db import models
import os
from core.storage_backends import get_profile_storage

def user_profile_photo_path(instance, filename):
    # Generate path for profile image
    ext = filename.split('.')[-1]
    return f'profile-photo.{ext}'

class CustomUser(AbstractUser):
    profile_photo = models.ImageField(
        upload_to=user_profile_photo_path,
        storage=get_profile_storage(),
        null=True,
        blank=True
    )
    bio = models.TextField(max_length=500, blank=True)
    phone = models.CharField(max_length=20, blank=True)
    delivery_address = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-date_joined']

    def __str__(self):
        return self.username

    @property
    def profile_photo_processed(self):
        if not self.profile_photo:
            return None
        path = str(self.profile_photo)
        base, ext = os.path.splitext(path)
        return f"images_profiles/{self.id}/profile-processed{ext}"
