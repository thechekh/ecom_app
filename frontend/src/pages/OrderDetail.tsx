import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    Box,
    Paper,
    Grid,
    Button,
    CircularProgress,
    Chip,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { fetchOrder, clearSelectedOrder } from '../store/slices/ordersSlice';
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

const OrderDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { selectedOrder: order, loading, error } = useAppSelector(state => state.orders);

    useEffect(() => {
        if (id) {
            dispatch(fetchOrder(parseInt(id)));
        }
        return () => {
            dispatch(clearSelectedOrder());
        };
    }, [id, dispatch]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Container maxWidth="md">
                <Paper elevation={3} sx={{ p: 3, mt: 4, textAlign: 'center' }}>
                    <Typography variant="h5" gutterBottom color="error">
                        {error}
                    </Typography>
                    <Button
                        variant="contained"
                        onClick={() => navigate('/orders')}
                        sx={{ mt: 2 }}
                    >
                        Back to Orders
                    </Button>
                </Paper>
            </Container>
        );
    }

    if (!order || !id) {
        return (
            <Container maxWidth="md">
                <Paper elevation={3} sx={{ p: 3, mt: 4, textAlign: 'center' }}>
                    <Typography variant="h5" gutterBottom>
                        Order not found
                    </Typography>
                    <Button
                        variant="contained"
                        onClick={() => navigate('/orders')}
                        sx={{ mt: 2 }}
                    >
                        Back to Orders
                    </Button>
                </Paper>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
                <Button
                    variant="outlined"
                    onClick={() => navigate('/orders')}
                >
                    Back to Orders
                </Button>
                <Typography variant="h4" component="h1">
                    Order #{order.id}
                </Typography>
                {order.status && (
                    <Chip
                        label={order.status.toUpperCase()}
                        color={getStatusColor(order.status)}
                    />
                )}
            </Box>

            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Order Information
                        </Typography>
                        <Box sx={{ mt: 2 }}>
                            <Typography variant="body2" color="text.secondary">
                                Ordered on: {formatDate(order.created_at)}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Payment Method: {order.payment_method.replace('_', ' ').toUpperCase()}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                                Contact Information:
                            </Typography>
                            <Typography variant="body2">
                                {order.contact_info.first_name} {order.contact_info.last_name}
                            </Typography>
                            <Typography variant="body2">
                                {order.contact_info.email}
                            </Typography>
                            <Typography variant="body2">
                                {order.contact_info.phone}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                                Shipping Address:
                            </Typography>
                            <Typography variant="body2">
                                {order.shipping_address}
                            </Typography>
                        </Box>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Order Items
                        </Typography>
                        <Box sx={{ mt: 2 }}>
                            {order.items.map((item) => (
                                <Box
                                    key={item.id}
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        mb: 2,
                                        pb: 2,
                                        borderBottom: '1px solid',
                                        borderColor: 'divider',
                                        '&:last-child': {
                                            mb: 0,
                                            pb: 0,
                                            borderBottom: 'none',
                                        },
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Box
                                            component="img"
                                            src={item.post.images[0]?.image}
                                            alt={item.post.caption}
                                            sx={{
                                                width: 80,
                                                height: 80,
                                                objectFit: 'cover',
                                                borderRadius: 1,
                                            }}
                                        />
                                        <Box>
                                            <Typography variant="body1">
                                                {item.post.caption}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Quantity: {item.quantity}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Price: ${Number(item.price).toFixed(2)}
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                        ${Number(item.price * item.quantity).toFixed(2)}
                                    </Typography>
                                </Box>
                            ))}
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    mt: 3,
                                    pt: 2,
                                    borderTop: '2px solid',
                                    borderColor: 'divider',
                                }}
                            >
                                <Typography variant="h6">Total</Typography>
                                <Typography variant="h6">
                                    ${Number(order.total_amount).toFixed(2)}
                                </Typography>
                            </Box>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default OrderDetail; 