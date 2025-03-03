from django.db import models
from django.conf import settings
from core.storage_backends import MediaStorage
import os

def post_image_path(instance, filename):
    # Generate path for original image
    ext = filename.split('.')[-1]
    return f'images_posts/{instance.post.user.id}/{instance.post.id}/post-photo.{ext}'

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
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(
        upload_to=post_image_path,
        storage=MediaStorage()
    )
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f'Image {self.order} for post {self.post.id}'

    @property
    def processed_image_url(self):
        if not self.image:
            return None
        path = str(self.image)
        base, ext = os.path.splitext(path)
        return f"images_posts/{self.post.user.id}/{self.post.id}/post-photo-processed{ext}"
