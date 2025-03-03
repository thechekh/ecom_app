import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    Paper,
    Grid,
    Box,
    Button,
    Card,
    CardContent,
    Divider,
    CircularProgress,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { fetchOrder, cancelOrder } from '../store/slices/ordersSlice';

const OrderDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { selectedOrder: order, loading, error } = useAppSelector(state => state.orders);

    useEffect(() => {
        if (id) {
            dispatch(fetchOrder(parseInt(id)));
        }
    }, [id, dispatch]);

    const handleCancel = async () => {
        if (order && window.confirm('Are you sure you want to cancel this order?')) {
            await dispatch(cancelOrder(order.id));
        }
    };

    if (loading && !order) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Typography color="error" align="center" sx={{ mt: 4 }}>
                {error}
            </Typography>
        );
    }

    if (!order) {
        return (
            <Typography align="center" sx={{ mt: 4 }}>
                Order not found
            </Typography>
        );
    }

    return (
        <Container maxWidth="lg">
            <Box sx={{ mt: 4, mb: 2 }}>
                <Button onClick={() => navigate('/orders')}>
                    Back to Orders
                </Button>
            </Box>

            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    <Paper elevation={3} sx={{ p: 3 }}>
                        <Typography variant="h5" gutterBottom>
                            Order #{order.id}
                        </Typography>

                        <Box sx={{ mt: 3 }}>
                            <Typography variant="h6" gutterBottom>
                                Items
                            </Typography>
                            {order.items.map((item) => (
                                <Card key={item.id} sx={{ mb: 2 }}>
                                    <CardContent>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} sm={8}>
                                                <Typography variant="subtitle1">
                                                    {item.post.caption}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Quantity: {item.quantity}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Price per item: ${item.price.toFixed(2)}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12} sm={4}>
                                                <Typography variant="h6" align="right">
                                                    ${(item.price * item.quantity).toFixed(2)}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            ))}
                        </Box>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Paper elevation={3} sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Order Summary
                        </Typography>

                        <Box sx={{ mt: 2 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Typography>Status</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography
                                        align="right"
                                        sx={{
                                            textTransform: 'capitalize',
                                            color: order.status === 'completed'
                                                ? 'success.main'
                                                : order.status === 'cancelled'
                                                    ? 'error.main'
                                                    : 'info.main',
                                        }}
                                    >
                                        {order.status}
                                    </Typography>
                                </Grid>

                                <Grid item xs={6}>
                                    <Typography>Date</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography align="right">
                                        {new Date(order.created_at).toLocaleDateString()}
                                    </Typography>
                                </Grid>

                                <Grid item xs={6}>
                                    <Typography>Payment Method</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography align="right" sx={{ textTransform: 'capitalize' }}>
                                        {order.payment_method.replace('_', ' ')}
                                    </Typography>
                                </Grid>
                            </Grid>

                            <Divider sx={{ my: 2 }} />

                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Typography variant="h6">Total</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="h6" align="right">
                                        ${order.total_amount.toFixed(2)}
                                    </Typography>
                                </Grid>
                            </Grid>

                            {order.status === 'pending' && (
                                <Button
                                    variant="outlined"
                                    color="error"
                                    fullWidth
                                    onClick={handleCancel}
                                    sx={{ mt: 2 }}
                                >
                                    Cancel Order
                                </Button>
                            )}
                        </Box>
                    </Paper>

                    <Paper elevation={3} sx={{ p: 3, mt: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Shipping Address
                        </Typography>
                        <Typography>
                            {order.shipping_address}
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default OrderDetail; 