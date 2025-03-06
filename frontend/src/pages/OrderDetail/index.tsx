import { useEffect, memo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    Box,
    Grid,
    Button,
    CircularProgress,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { fetchOrder, clearSelectedOrder } from '../../store/slices/ordersSlice';
import OrderInfo from './components/OrderInfo';
import OrderItems from './components/OrderItems';
import ErrorView from './components/ErrorView';

const LoadingView = memo(() => (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
    </Box>
));

LoadingView.displayName = 'LoadingView';

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

    const handleBack = useCallback(() => {
        navigate('/orders');
    }, [navigate]);

    if (loading) {
        return <LoadingView />;
    }

    if (error || !order || !id) {
        return <ErrorView error={error} onBack={handleBack} />;
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
                <Button
                    variant="outlined"
                    onClick={handleBack}
                >
                    Back to Orders
                </Button>
                <Typography variant="h4" component="h1">
                    Order #{order.id}
                </Typography>
            </Box>

            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <OrderInfo order={order} />
                </Grid>
                <Grid item xs={12} md={6}>
                    <OrderItems items={order.items} totalAmount={order.total_amount} />
                </Grid>
            </Grid>
        </Container>
    );
};

export default memo(OrderDetail); 