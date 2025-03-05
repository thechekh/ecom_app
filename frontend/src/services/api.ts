import axios from 'axios';
import { LoginCredentials, RegisterData, User, Post, Cart, Order } from '../types';

const API_URL = 'http://localhost:8000/api';

// Function to get CSRF token from cookies
const getCSRFToken = () => {
    const name = 'csrftoken';
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
};

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    xsrfCookieName: 'csrftoken',
    xsrfHeaderName: 'X-CSRFToken',
});

// Request interceptor to add CSRF token
api.interceptors.request.use((config) => {
    const csrfToken = getCSRFToken();
    if (csrfToken) {
        config.headers['X-CSRFToken'] = csrfToken;
    }
    return config;
});

// Response interceptor to handle authentication errors
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
            // Clear user data if authentication fails
            localStorage.removeItem('user');
        }
        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    register: (data: RegisterData) => api.post<User>('/users/register/', data),
    login: (credentials: LoginCredentials) => api.post<User>('/users/login/', credentials),
    logout: () => api.post('/users/logout/'),
    getProfile: () => api.get<User>('/users/profile/'),
    updateProfile: (data: FormData) => api.put<User>('/users/profile/edit/', data),
};

// Posts API
export const postsAPI = {
    getPosts: (page = 1, search = '', sort = '-created_at') =>
        api.get<{ count: number; results: Post[] }>('/posts/', { params: { page, search, sort } }),
    getPost: (id: number) => api.get<Post>(`/posts/${id}/`),
    createPost: (data: FormData) => api.post<Post>('/posts/create/', data),
    updatePost: (id: number, data: FormData) => api.put<Post>(`/posts/${id}/edit/`, data),
    deletePost: (id: number) => api.delete(`/posts/${id}/delete/`),
};

// Cart API
export const cartAPI = {
    getCart: () => api.get<Cart>('/orders/cart/'),
    addToCart: (post_id: number, quantity = 1) =>
        api.post<Cart>('/orders/cart/add/', { post_id, quantity }),
    removeFromCart: (itemId: number) =>
        api.delete(`/orders/cart/remove/${itemId}/`),
    updateCartItem: async (itemId: number, quantity: number) => {
        const response = await api.patch<Cart>(`/orders/cart/update/${itemId}/`, { quantity });
        return response.data;
    },
};

// Orders API
export const ordersAPI = {
    getOrders: () => api.get<{ count: number; results: Order[] }>('/orders/'),
    getOrder: (id: number) => api.get<Order>(`/orders/${id}/`),
    createOrder: async (data: {
        payment_method: string;
        shipping_address: string;
        contact_info: {
            first_name: string;
            last_name: string;
            email: string;
            phone: string;
        }
    }) => {
        try {
            console.log('Creating order with data:', data);
            const response = await api.post<Order>('/orders/create/', data);
            console.log('Order creation response:', response.data);
            return response;
        } catch (error: any) {
            console.error('API Error:', error.response?.data || error.message);
            throw error;
        }
    },
    cancelOrder: (id: number) => api.put<Order>(`/orders/${id}/cancel/`),
};

export default api; 