from django.db import models
from django.conf import settings
from core.storage_backends import get_post_storage
from django.utils import timezone
import os

def post_image_path(instance, filename):
    # Generate path for post image
    ext = filename.split('.')[-1]
    return f'post-{instance.post.id}-{instance.id}.{ext}'

class Post(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='posts')
    caption = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.user.username} - {self.created_at}'

class PostImage(models.Model):
    post = models.ForeignKey(Post, related_name='images', on_delete=models.CASCADE)
    image = models.ImageField(
        upload_to=post_image_path,
        storage=get_post_storage()
    )
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return f'Image for post {self.post.id}'

    @property
    def image_url(self):
        if not self.image:
            return None
        return self.image.url if hasattr(self.image, 'url') else None

    @property
    def processed_image_url(self):
        if not self.image:
            return None
        path = str(self.image)
        base, ext = os.path.splitext(path)
        return f"images_posts/{self.post.user.id}/{self.post.id}/post-photo-processed{ext}"
