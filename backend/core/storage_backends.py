from django.conf import settings
from django.core.files.storage import FileSystemStorage
from storages.backends.s3boto3 import S3Boto3Storage
import os

class MediaStorage(S3Boto3Storage):
    location = ''
    file_overwrite = False

class ProfileStorage(S3Boto3Storage):
    location = 'profiles'
    file_overwrite = True

class PostStorage(S3Boto3Storage):
    location = 'posts'
    file_overwrite = False

def get_profile_storage():
    if settings.DEBUG:
        # For local development, use FileSystemStorage with profiles subdirectory
        storage_path = os.path.join(settings.MEDIA_ROOT, 'profiles')
        os.makedirs(storage_path, exist_ok=True)
        return FileSystemStorage(
            location=storage_path,
            base_url=f"{settings.MEDIA_URL}profiles/"
        )
    return ProfileStorage()

def get_post_storage():
    if settings.DEBUG:
        # For local development, use FileSystemStorage with posts subdirectory
        storage_path = os.path.join(settings.MEDIA_ROOT, 'posts')
        os.makedirs(storage_path, exist_ok=True)
        return FileSystemStorage(
            location=storage_path,
            base_url=f"{settings.MEDIA_URL}posts/"
        )
    return PostStorage() 