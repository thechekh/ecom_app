import { useEffect, useState, memo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    Box,
    Grid,
    CircularProgress,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { fetchCart, removeFromCart } from '../../store/slices/cartSlice';
import FormError from '../../components/FormError';
import CartItemComponent from './components/CartItemComponent';
import OrderSummary from './components/OrderSummary';
import EmptyCart from './components/EmptyCart';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';

const Cart = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { cart, loading, error } = useAppSelector(state => state.cart);
    const [updatingItems, setUpdatingItems] = useState<{ [key: number]: boolean }>({});
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<number | null>(null);

    useEffect(() => {
        dispatch(fetchCart());
    }, [dispatch]);

    const handleRemoveItem = useCallback(async (itemId: number) => {
        setItemToDelete(itemId);
        setDeleteDialogOpen(true);
    }, []);

    const handleDeleteConfirm = useCallback(async () => {
        if (itemToDelete) {
            setDeleteDialogOpen(false);
            setUpdatingItems(prev => ({ ...prev, [itemToDelete]: true }));
            try {
                await dispatch(removeFromCart(itemToDelete)).unwrap();
                await dispatch(fetchCart());
            } finally {
                setUpdatingItems(prev => ({ ...prev, [itemToDelete]: false }));
            }
        }
    }, [dispatch, itemToDelete]);

    const handleDeleteCancel = useCallback(() => {
        setDeleteDialogOpen(false);
        setItemToDelete(null);
    }, []);

    const handleCheckout = useCallback(() => {
        navigate('/checkout');
    }, [navigate]);

    const handleContinueShopping = useCallback(() => {
        navigate('/');
    }, [navigate]);

    if (!cart && loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!cart?.items || cart.items.length === 0) {
        return <EmptyCart onContinueShopping={handleContinueShopping} />;
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
                        <CartItemComponent
                            key={item.id}
                            item={item}
                            onRemove={handleRemoveItem}
                            isUpdating={updatingItems[item.id] || false}
                        />
                    ))}
                </Grid>
                <Grid item xs={12} md={4}>
                    <OrderSummary
                        total={cart.total_amount}
                        onCheckout={handleCheckout}
                        disabled={loading}
                    />
                </Grid>
            </Grid>

            <Dialog
                open={deleteDialogOpen}
                onClose={handleDeleteCancel}
            >
                <DialogTitle>Remove Item</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to remove this item from your cart?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteCancel} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleDeleteConfirm} color="error" autoFocus>
                        Remove
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default memo(Cart); 