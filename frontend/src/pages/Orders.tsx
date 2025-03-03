import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Box,
    CircularProgress,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { fetchOrders } from '../store/slices/ordersSlice';
import { Order } from '../types';

const Orders = () => {
    const navigate = useNavigate();
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
        return (
            <Typography color="error" align="center" sx={{ mt: 4 }}>
                {error}
            </Typography>
        );
    }

    // Handle both array and paginated responses
    const ordersList: Order[] = Array.isArray(orders) ? orders : (orders as any)?.results || [];

    if (!ordersList || ordersList.length === 0) {
        return (
            <Container maxWidth="md">
                <Paper elevation={3} sx={{ p: 3, mt: 4, textAlign: 'center' }}>
                    <Typography variant="h5" gutterBottom>
                        No orders found
                    </Typography>
                    <Button
                        variant="contained"
                        onClick={() => navigate('/')}
                        sx={{ mt: 2 }}
                    >
                        Continue Shopping
                    </Button>
                </Paper>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg">
            <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 4 }}>
                My Orders
            </Typography>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Order ID</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Total</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {ordersList.map((order: Order) => (
                            <TableRow key={order.id}>
                                <TableCell>#{order.id}</TableCell>
                                <TableCell>
                                    {new Date(order.created_at).toLocaleDateString()}
                                </TableCell>
                                <TableCell>
                                    <Typography
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
                                </TableCell>
                                <TableCell>${Number(order.total_amount).toFixed(2)}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        onClick={() => navigate(`/orders/${order.id}`)}
                                    >
                                        View Details
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};

export default Orders; 