export interface User {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    profile_photo?: string;
    bio?: string;
}

export interface Post {
    id: number;
    user: User;
    caption: string;
    price: number;
    created_at: string;
    updated_at: string;
    images: PostImage[];
}

export interface PostImage {
    id: number;
    image: string;
    order: number;
}

export interface CartItem {
    id: number;
    post: Post;
    quantity: number;
    added_at: string;
}

export interface Cart {
    id: number;
    items: CartItem[];
    total_amount: number;
    created_at: string;
    updated_at: string;
}

export interface Order {
    id: number;
    user: User;
    status: 'pending' | 'processing' | 'completed' | 'cancelled';
    payment_method: 'bank' | 'stripe' | 'google_pay' | 'apple_pay';
    total_amount: number;
    shipping_address: string;
    items: OrderItem[];
    created_at: string;
    updated_at: string;
}

export interface OrderItem {
    id: number;
    post: Post;
    quantity: number;
    price: number;
    created_at: string;
}

export interface LoginCredentials {
    username: string;
    password: string;
}

export interface RegisterData extends LoginCredentials {
    email: string;
    first_name: string;
    last_name: string;
    password2: string;
} 