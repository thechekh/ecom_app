import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { cartAPI } from '../../services/api';
import { Cart, CartItem } from '../../types';

interface CartState {
    cart: Cart | null;
    loading: boolean;
    error: string | null;
}

const initialState: CartState = {
    cart: null,
    loading: false,
    error: null,
};

export const fetchCart = createAsyncThunk(
    'cart/fetchCart',
    async () => {
        const response = await cartAPI.getCart();
        return response.data;
    }
);

export const addToCart = createAsyncThunk(
    'cart/addToCart',
    async ({ postId, quantity }: { postId: number; quantity: number }) => {
        const response = await cartAPI.addToCart(postId, quantity);
        return response.data;
    }
);

export const removeFromCart = createAsyncThunk(
    'cart/removeFromCart',
    async (itemId: number) => {
        await cartAPI.removeFromCart(itemId);
        return itemId;
    }
);

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearCart: (state) => {
            state.cart = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch Cart
            .addCase(fetchCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.loading = false;
                state.cart = action.payload;
            })
            .addCase(fetchCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch cart';
            })
            // Add to Cart
            .addCase(addToCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addToCart.fulfilled, (state, action) => {
                state.loading = false;
                state.cart = action.payload;
            })
            .addCase(addToCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to add item to cart';
            })
            // Remove from Cart
            .addCase(removeFromCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(removeFromCart.fulfilled, (state, action) => {
                state.loading = false;
                if (state.cart) {
                    state.cart.items = state.cart.items.filter(item => item.id !== action.payload);
                    state.cart.total_amount = state.cart.items.reduce(
                        (total, item) => total + (item.quantity * Number(item.post.price)),
                        0
                    );
                }
            })
            .addCase(removeFromCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to remove item from cart';
            });
    },
});

export const { clearError, clearCart } = cartSlice.actions;
export default cartSlice.reducer; 