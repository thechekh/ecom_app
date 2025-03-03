from django.urls import path
from . import views

app_name = 'orders'

urlpatterns = [
    # Cart endpoints
    path('cart/', views.CartView.as_view(), name='cart'),
    path('cart/add/', views.AddToCartView.as_view(), name='add-to-cart'),
    path('cart/remove/<int:pk>/', views.RemoveFromCartView.as_view(), name='remove-from-cart'),
    path('cart/update/<int:pk>/', views.UpdateCartItemView.as_view(), name='update-cart-item'),
    
    # Order endpoints
    path('', views.OrderListView.as_view(), name='order-list'),
    path('<int:pk>/', views.OrderDetailView.as_view(), name='order-detail'),
    path('create/', views.OrderCreateView.as_view(), name='order-create'),
    path('<int:pk>/cancel/', views.OrderCancelView.as_view(), name='order-cancel'),
] 