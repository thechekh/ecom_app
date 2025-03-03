import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ordersAPI } from '../../services/api';
import { Order } from '../../types';

interface PaginatedResponse {
    count: number;
    results: Order[];
}

interface OrdersState {
    items: Order[];
    selectedOrder: Order | null;
    loading: boolean;
    error: string | null;
}

const initialState: OrdersState = {
    items: [],
    selectedOrder: null,
    loading: false,
    error: null,
};

export const fetchOrders = createAsyncThunk(
    'orders/fetchOrders',
    async () => {
        const response = await ordersAPI.getOrders();
        return response.data;
    }
);

export const fetchOrder = createAsyncThunk(
    'orders/fetchOrder',
    async (id: number) => {
        const response = await ordersAPI.getOrder(id);
        return response.data;
    }
);

export const checkout = createAsyncThunk(
    'orders/checkout',
    async (data: { payment_method: string; shipping_address: string }) => {
        const response = await ordersAPI.createOrder(data);
        return response.data;
    }
);

export const cancelOrder = createAsyncThunk(
    'orders/cancelOrder',
    async (id: number) => {
        const response = await ordersAPI.cancelOrder(id);
        return response.data;
    }
);

const ordersSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearSelectedOrder: (state) => {
            state.selectedOrder = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch Orders
            .addCase(fetchOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch orders';
            })
            // Fetch Single Order
            .addCase(fetchOrder.fulfilled, (state, action) => {
                state.selectedOrder = action.payload;
            })
            // Checkout
            .addCase(checkout.fulfilled, (state, action) => {
                state.items.unshift(action.payload);
                state.selectedOrder = action.payload;
            })
            // Cancel Order
            .addCase(cancelOrder.fulfilled, (state, action) => {
                const index = state.items.findIndex(order => order.id === action.payload.id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
                if (state.selectedOrder?.id === action.payload.id) {
                    state.selectedOrder = action.payload;
                }
            });
    },
});

export const { clearError, clearSelectedOrder } = ordersSlice.actions;
export default ordersSlice.reducer; 