from rest_framework import serializers
from .models import Order, OrderItem, Cart, CartItem
from posts.serializers import PostSerializer

class CartItemSerializer(serializers.ModelSerializer):
    post = PostSerializer(read_only=True)
    post_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = CartItem
        fields = ('id', 'post', 'post_id', 'quantity', 'added_at')
        read_only_fields = ('id', 'added_at')

class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total_amount = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = ('id', 'items', 'total_amount', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at')

    def get_total_amount(self, obj):
        return sum(item.post.price * item.quantity for item in obj.items.all())

class OrderItemSerializer(serializers.ModelSerializer):
    post = PostSerializer(read_only=True)

    class Meta:
        model = OrderItem
        fields = ('id', 'post', 'quantity', 'price', 'created_at')
        read_only_fields = ('id', 'created_at')

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = ('id', 'user', 'status', 'payment_method', 'total_amount', 'shipping_address',
                 'contact_info', 'items', 'created_at', 'updated_at')
        read_only_fields = ('id', 'user', 'created_at', 'updated_at')

class OrderCreateSerializer(serializers.ModelSerializer):
    contact_info = serializers.JSONField()

    class Meta:
        model = Order
        fields = ('payment_method', 'shipping_address', 'contact_info')

    def to_representation(self, instance):
        return OrderSerializer(instance, context=self.context).data

    def create(self, validated_data):
        user = self.context['request'].user
        cart = user.cart

        if not cart or not cart.items.exists():
            raise serializers.ValidationError({"cart": "Cart is empty"})

        contact_info = validated_data.pop('contact_info', {})
        
        # Calculate total amount from cart
        total_amount = sum(item.post.price * item.quantity for item in cart.items.all())

        # Create order
        order = Order.objects.create(
            user=user,
            total_amount=total_amount,
            contact_info=contact_info,
            **validated_data
        )

        # Create order items from cart items
        for cart_item in cart.items.all():
            OrderItem.objects.create(
                order=order,
                post=cart_item.post,
                quantity=cart_item.quantity,
                price=cart_item.post.price
            )

        # Clear the cart
        cart.items.all().delete()

        return order 