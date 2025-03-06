import { useEffect, memo } from 'react';
import { Container, Typography, Box, Grid, CircularProgress } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { fetchOrders } from '../../store/slices/ordersSlice';
import FormError from '../../components/FormError';
import OrderCard from './components/OrderCard';
import EmptyState from './components/EmptyState';

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
        return <EmptyState message="No orders found" />;
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                My Orders
            </Typography>

            <Grid container spacing={3}>
                {orders.map((order) => (
                    <Grid item xs={12} key={order.id}>
                        <OrderCard order={order} />
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default memo(Orders); 