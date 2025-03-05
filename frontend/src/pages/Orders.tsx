import { useEffect } from 'react';
import {
    Container,
    Typography,
    Box,
    Paper,
    Grid,
    CircularProgress,
    Chip,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { fetchOrders } from '../store/slices/ordersSlice';
import FormError from '../components/FormError';

const getStatusColor = (status: string) => {
    switch (status) {
        case 'pending':
            return 'warning';
        case 'processing':
            return 'info';
        case 'completed':
            return 'success';
        case 'cancelled':
            return 'error';
        default:
            return 'default';
    }
};

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

const Orders = () => {
    const dispatch = useAppDispatch();
    const { items: orders, loading, error } = useAppSelector(state => state.orders);

    useEffect(() => {
        dispatch(fetchOrders());
    }, [dispatch]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return <FormError error={error} />;
    }

    if (!orders || !orders.length) {
        return (
            <Container maxWidth="md">
                <Paper elevation={3} sx={{ p: 3, mt: 4, textAlign: 'center' }}>
                    <Typography variant="h5" gutterBottom>
                        No orders found
                    </Typography>
                </Paper>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                My Orders
            </Typography>

            <Grid container spacing={3}>
                {orders.map((order) => (
                    <Grid item xs={12} key={order.id}>
                        <Paper elevation={3} sx={{ p: 3 }}>
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="h6">
                                    Order #{order.id}
                                </Typography>
                            </Box>

                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="body2" color="text.secondary">
                                        Ordered on: {formatDate(order.created_at)}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Payment Method: {(order.payment_method || '').replace('_', ' ').toUpperCase()}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                        Shipping Address:
                                    </Typography>
                                    <Typography variant="body2">
                                        {order.shipping_address}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle2" gutterBottom>
                                        Order Items:
                                    </Typography>
                                    {order.items?.map((item) => (
                                        <Box key={item.id} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                <Box
                                                    component="img"
                                                    src={item.post.images[0]?.image}
                                                    alt={item.post.caption}
                                                    sx={{
                                                        width: 50,
                                                        height: 50,
                                                        objectFit: 'cover',
                                                    }}
                                                />
                                                <Box>
                                                    <Typography variant="body2">
                                                        {item.post.caption}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Quantity: {item.quantity}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                            <Typography variant="body2">
                                                ${Number(item.price).toFixed(2)}
                                            </Typography>
                                        </Box>
                                    ))}
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                                        <Typography variant="h6">
                                            Total: ${Number(order.total_amount || 0).toFixed(2)}
                                        </Typography>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default Orders; 