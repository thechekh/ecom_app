# E-commerce Platform with Django and React

A full-stack e-commerce platform built with Django REST Framework and React + TypeScript.

## Features

- User authentication (registration, login, logout)
- User profile management with profile photos
- Post creation with multiple image upload support
- Shopping cart functionality
- Order management system
- Admin panel for managing users, posts, and orders
- RESTful API
- AWS S3 integration for file storage
- Responsive design with Material-UI

## Backend Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd <repository-name>
```

2. Create and activate a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

5. Run migrations:
```bash
python manage.py migrate
```

6. Create a superuser:
```bash
python manage.py createsuperuser
```

7. Run the development server:
```bash
python manage.py runserver
```

## Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

## Docker Setup

1. Build and run the containers:
```bash
docker-compose up --build
```

2. Run migrations:
```bash
docker-compose exec backend python manage.py migrate
```

3. Create a superuser:
```bash
docker-compose exec backend python manage.py createsuperuser
```

## API Documentation

### Authentication Endpoints

- POST `/api/users/register/` - Register a new user
- POST `/api/users/login/` - Login user
- POST `/api/users/logout/` - Logout user
- GET `/api/users/profile/` - Get user profile
- PUT `/api/users/profile/edit/` - Update user profile

### Posts Endpoints

- GET `/api/posts/` - List all posts
- GET `/api/posts/<id>/` - Get post details
- POST `/api/posts/create/` - Create a new post
- PUT `/api/posts/<id>/edit/` - Update a post
- DELETE `/api/posts/<id>/delete/` - Delete a post

### Cart Endpoints

- GET `/api/orders/cart/` - Get user's cart
- POST `/api/orders/cart/add/` - Add item to cart
- DELETE `/api/orders/cart/remove/<id>/` - Remove item from cart
- PATCH `/api/orders/cart/update/<id>/` - Update cart item quantity

### Order Endpoints

- GET `/api/orders/` - List user's orders
- GET `/api/orders/<id>/` - Get order details
- POST `/api/orders/create/` - Create a new order
- PUT `/api/orders/<id>/cancel/` - Cancel an order

## AWS Configuration

1. Create an S3 bucket for file storage
2. Configure AWS credentials in `.env`:
```
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_STORAGE_BUCKET_NAME=your_bucket_name
AWS_S3_REGION_NAME=your_region
```

## Production Deployment

1. Set up an EC2 instance
2. Install Docker and Docker Compose
3. Configure Nginx as a reverse proxy
4. Set up SSL certificates
5. Configure environment variables
6. Deploy using Docker Compose

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License. 