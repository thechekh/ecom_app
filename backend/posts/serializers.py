from rest_framework import serializers
from .models import Post, PostImage
from users.serializers import UserSerializer

class PostImageSerializer(serializers.ModelSerializer):
    processed_url = serializers.CharField(source='processed_image_url', read_only=True)

    class Meta:
        model = PostImage
        fields = ('id', 'image', 'processed_url')

class PostSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    images = PostImageSerializer(many=True, read_only=True)
    uploaded_images = serializers.ListField(
        child=serializers.ImageField(max_length=1000000, allow_empty_file=False, use_url=False),
        write_only=True,
        required=False
    )

    class Meta:
        model = Post
        fields = ('id', 'user', 'caption', 'price', 'created_at', 'updated_at', 'images', 'uploaded_images')
        read_only_fields = ('id', 'user', 'created_at', 'updated_at')

    def create(self, validated_data):
        uploaded_images = validated_data.pop('uploaded_images', [])
        post = Post.objects.create(**validated_data)

        for image in uploaded_images:
            PostImage.objects.create(post=post, image=image)

        return post

    def update(self, instance, validated_data):
        uploaded_images = validated_data.pop('uploaded_images', [])
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if uploaded_images:
            # Delete existing images
            instance.images.all().delete()
            # Create new images
            for image in uploaded_images:
                PostImage.objects.create(post=instance, image=image)

        return instance 