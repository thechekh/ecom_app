from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from django.db.models import Q
from .models import Post
from .serializers import PostSerializer

# Create your views here.

class PostPagination(PageNumberPagination):
    page_size = 9
    page_size_query_param = 'page_size'
    max_page_size = 100

class PostListView(generics.ListAPIView):
    serializer_class = PostSerializer
    permission_classes = (IsAuthenticatedOrReadOnly,)
    pagination_class = PostPagination

    def get_queryset(self):
        queryset = Post.objects.all()
        
        # Handle search
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                Q(caption__icontains=search) |
                Q(user__username__icontains=search)
            )
        
        # Handle sorting
        sort = self.request.query_params.get('sort', '-created_at')
        if sort == 'created_at':  # Date A-Z
            queryset = queryset.order_by('created_at')
        elif sort == '-created_at':  # Date Z-A (default)
            queryset = queryset.order_by('-created_at')
        elif sort == 'price':  # Price A-Z
            queryset = queryset.order_by('price')
        elif sort == '-price':  # Price Z-A
            queryset = queryset.order_by('-price')
        
        return queryset

class PostDetailView(generics.RetrieveAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = (IsAuthenticatedOrReadOnly,)

class PostCreateView(generics.CreateAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = (IsAuthenticated,)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class PostUpdateView(generics.UpdateAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        return Post.objects.filter(user=self.request.user)

class PostDeleteView(generics.DestroyAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        return Post.objects.filter(user=self.request.user)
