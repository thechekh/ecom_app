import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Paper,
    Typography,
    Box,
    Grid,
    Card,
    CardMedia,
    CardContent,
    IconButton,
    Button,
    CircularProgress,
    Divider,
} from '@mui/material';
import {
    Delete as DeleteIcon,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import {
    fetchCart,
    removeFromCart,
} from '../store/slices/cartSlice';
import FormError from '../components/FormError';

const Cart = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { cart, loading, error } = useAppSelector(state => state.cart);
    const [updatingItems, setUpdatingItems] = useState<{ [key: number]: boolean }>({});

    useEffect(() => {
        dispatch(fetchCart());
    }, [dispatch]);

    const handleRemoveItem = async (itemId: number) => {
        if (window.confirm('Are you sure you want to remove this item from your cart?')) {
            setUpdatingItems(prev => ({ ...prev, [itemId]: true }));
            try {
                await dispatch(removeFromCart(itemId)).unwrap();
                await dispatch(fetchCart());
            } finally {
                setUpdatingItems(prev => ({ ...prev, [itemId]: false }));
            }
        }
    };

    const handleCheckout = () => {
        navigate('/checkout');
    };

    if (!cart && loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!cart) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!cart.items || cart.items.length === 0) {
        return (
            <Container maxWidth="md">
                <Paper elevation={3} sx={{ p: 3, mt: 4, textAlign: 'center' }}>
                    <Typography variant="h5" gutterBottom>
                        Your cart is empty
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
                Shopping Cart
            </Typography>

            <FormError error={error} />

            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    {cart.items.map((item) => (
                        <Card key={item.id} sx={{ mb: 2, display: 'flex', position: 'relative' }}>
                            {updatingItems[item.id] && (
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        bgcolor: 'rgba(255, 255, 255, 0.7)',
                                        zIndex: 1,
                                    }}
                                >
                                    <CircularProgress size={24} />
                                </Box>
                            )}
                            <CardMedia
                                component="img"
                                sx={{ width: 150, height: 150, objectFit: 'cover' }}
                                image={item.post.images[0]?.image}
                                alt={item.post.caption}
                            />
                            <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                                <CardContent sx={{ flex: '1 0 auto' }}>
                                    <Typography variant="h6" gutterBottom>
                                        {item.post.user.username}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                        {item.post.caption}
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Typography variant="h6" color="primary">
                                            ${Number(item.post.price).toFixed(2)}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Quantity: {item.quantity}
                                        </Typography>
                                    </Box>
                                </CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', pl: 2, pb: 2 }}>
                                    <IconButton
                                        onClick={() => handleRemoveItem(item.id)}
                                        color="error"
                                        disabled={updatingItems[item.id]}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </Box>
                            </Box>
                        </Card>
                    ))}
                </Grid>
                <Grid item xs={12} md={4}>
                    <Paper elevation={3} sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Order Summary
                        </Typography>
                        <Box sx={{ my: 2 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Typography>Subtotal</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography align="right">
                                        ${Number(cart.total_amount).toFixed(2)}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Box>
                        <Divider sx={{ my: 2 }} />
                        <Box sx={{ my: 2 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Typography variant="h6">Total</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="h6" align="right">
                                        ${Number(cart.total_amount).toFixed(2)}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Box>
                        <Button
                            variant="contained"
                            fullWidth
                            size="large"
                            onClick={handleCheckout}
                            disabled={loading}
                        >
                            Proceed to Checkout
                        </Button>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default Cart; 