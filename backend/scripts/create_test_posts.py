import os
import sys
import django
import random
import requests
import time
from decimal import Decimal
from django.core.files.uploadedfile import SimpleUploadedFile
from io import BytesIO

# Add the project root directory to the Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from users.models import CustomUser
from posts.models import Post, PostImage

def get_picsum_image(width=600, height=600, retries=3):
    """Fetch an image from Lorem Picsum"""
    # Using Lorem Picsum API
    url = f"https://picsum.photos/{width}/{height}"
    
    for attempt in range(retries):
        try:
            # Lorem Picsum automatically redirects to a random image
            response = requests.get(url, timeout=5, allow_redirects=True)
            
            if response.status_code == 200:
                # Create a file-like object from the image data
                image_io = BytesIO(response.content)
                return SimpleUploadedFile(
                    name=f'picsum_{random.randint(1000, 9999)}.jpg',
                    content=image_io.getvalue(),
                    content_type='image/jpeg'
                )
        except Exception as e:
            print(f"Attempt {attempt + 1}: Error - {str(e)}")
        
        # Small delay before retry
        time.sleep(0.5)
    
    return None

def create_test_posts():
    # Get all test users
    users = CustomUser.objects.filter(username__in=['danil', 'user1', 'user2'])
    
    if not users:
        print("No test users found. Please run create_test_users.py first.")
        return

    # Create 20 posts (about 7 posts per user)
    total_posts = 20
    posts_per_user = total_posts // len(users)
    remaining_posts = total_posts % len(users)

    post_counter = 1  # Counter for all posts across users

    for user in users:
        # Calculate how many posts this user should get
        user_posts = posts_per_user + (1 if remaining_posts > 0 else 0)
        remaining_posts = max(0, remaining_posts - 1)

        for i in range(user_posts):
            price = Decimal(random.uniform(10.0, 100.0)).quantize(Decimal('0.01'))
            
            # Create post with simple caption
            post = Post.objects.create(
                user=user,
                caption=f"Caption for post {post_counter}",
                price=price
            )
            
            # Try to get a Picsum image
            image = get_picsum_image()
            if image:
                PostImage.objects.create(
                    post=post,
                    image=image
                )
                print(f"Created post {post.id} with image for user {user.username}")
            else:
                # If Picsum fails, create a colored placeholder as fallback
                from PIL import Image
                color = (random.randint(50, 200), random.randint(50, 200), random.randint(50, 200))
                img = Image.new('RGB', (600, 600), color)
                img_io = BytesIO()
                img.save(img_io, format='JPEG', quality=90)
                img_io.seek(0)
                
                fallback_image = SimpleUploadedFile(
                    name=f'placeholder_{post.id}.jpg',
                    content=img_io.getvalue(),
                    content_type='image/jpeg'
                )
                PostImage.objects.create(
                    post=post,
                    image=fallback_image
                )
                print(f"Created post {post.id} with fallback image for user {user.username}")
            
            post_counter += 1  # Increment the counter
            # Small delay between posts
            time.sleep(0.2)

if __name__ == '__main__':
    print("Creating test posts...")
    create_test_posts()
    print("Done!") 