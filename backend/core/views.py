from django.http import JsonResponse
from django.conf import settings
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser

@api_view(['GET'])
@permission_classes([IsAdminUser])
def test_env(request):
    """Test view to check environment variables (only accessible by admin)"""
    env_vars = {
        'DEBUG': settings.DEBUG,
        'AWS_ACCESS_KEY_ID': bool(settings.AWS_ACCESS_KEY_ID),  # Don't expose actual key
        'AWS_SECRET_ACCESS_KEY': bool(settings.AWS_SECRET_ACCESS_KEY),  # Don't expose actual key
        'AWS_STORAGE_BUCKET_NAME': settings.AWS_STORAGE_BUCKET_NAME,
        'AWS_S3_REGION_NAME': settings.AWS_S3_REGION_NAME,
        'DATABASE_NAME': settings.DATABASES['default']['NAME'],
        'DATABASE_USER': settings.DATABASES['default']['USER'],
        'DATABASE_HOST': settings.DATABASES['default']['HOST'],
        'DATABASE_PORT': settings.DATABASES['default']['PORT'],
    }
    return JsonResponse(env_vars) 