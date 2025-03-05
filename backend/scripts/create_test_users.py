import os
import sys
import django

# Add the project root directory to the Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from users.models import CustomUser

def create_test_users():
    # List of test users to create
    test_users = [
        {'username': 'danil', 'email': 'danil@example.com'},
        {'username': 'user1', 'email': 'user1@example.com'},
        {'username': 'user2', 'email': 'user2@example.com'},
    ]

    created_users = []
    for user_data in test_users:
        try:
            # Try to get existing user
            user = CustomUser.objects.get(username=user_data['username'])
            print(f"User exists: {user.username}")
            # Update password
            user.set_password('qw123')
            user.email = user_data['email']  # Update email if needed
            user.save()
            print(f"Updated password for: {user.username}")
        except CustomUser.DoesNotExist:
            # Create new user
            user = CustomUser.objects.create_user(
                username=user_data['username'],
                email=user_data['email'],
                password='qw123',
                is_active=True
            )
            print(f"Created new user: {user.username}")
        
        created_users.append(user)
    
    return created_users

if __name__ == '__main__':
    print("Creating/updating test users...")
    create_test_users()
    print("Done!") 