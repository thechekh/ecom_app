import { useState, memo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
    Container,
    Typography,
    Box,
    Grid,
    TextField,
    Button,
    CircularProgress,
    Paper,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { checkout } from '../../store/slices/ordersSlice';
import FormError from '../../components/FormError';
import ContactForm from './components/ContactForm';
import PaymentMethodSelector from './components/PaymentMethodSelector';
import CartSummary from './components/CartSummary';
import EmptyState from './components/EmptyState';
import { CheckoutFormValues } from '../../types';

const validationSchema = Yup.object({
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    phone: Yup.string().required('Phone number is required'),
    deliveryAddress: Yup.string().required('Delivery address is required'),
    paymentMethod: Yup.string().required('Payment method is required'),
});

const LoadingState = memo(() => (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
    </Box>
));

const Checkout = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { cart, loading: cartLoading } = useAppSelector(state => state.cart);
    const { loading: orderLoading, error } = useAppSelector(state => state.orders);
    const { user } = useAppSelector(state => state.auth);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const handleSubmit = useCallback(async (values: CheckoutFormValues) => {
        setSubmitError(null);
        const orderData = {
            payment_method: values.paymentMethod,
            shipping_address: values.deliveryAddress,
            contact_info: {
                first_name: values.firstName,
                last_name: values.lastName,
                email: values.email,
                phone: values.phone,
            }
        };

        try {
            const result = await dispatch(checkout(orderData)).unwrap();
            if (result?.id) {
                navigate(`/orders/${result.id}`);
            } else {
                setSubmitError('Invalid response from server');
            }
        } catch (error: any) {
            setSubmitError(
                error.response?.data?.detail ||
                error.message ||
                'Failed to create order. Please try again.'
            );
        }
    }, [dispatch, navigate]);

    const formik = useFormik({
        initialValues: {
            firstName: user?.first_name || '',
            lastName: user?.last_name || '',
            email: user?.email || '',
            phone: user?.phone || '',
            deliveryAddress: user?.delivery_address || '',
            paymentMethod: user?.preferred_payment_method || 'bank',
        },
        validationSchema,
        enableReinitialize: true,
        onSubmit: handleSubmit,
    });

    if (cartLoading || !cart) {
        return <LoadingState />;
    }

    if (!cart.items || cart.items.length === 0) {
        return <EmptyState onContinueShopping={() => navigate('/')} />;
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Contact Details
                        </Typography>

                        {(error || submitError) && (
                            <Box sx={{ mb: 2 }}>
                                <FormError error={error || submitError} />
                            </Box>
                        )}

                        <form onSubmit={formik.handleSubmit}>
                            <ContactForm formik={formik} />

                            <Box sx={{ mt: 4 }}>
                                <Typography variant="h6" gutterBottom>
                                    Delivery Details
                                </Typography>
                                <TextField
                                    fullWidth
                                    name="deliveryAddress"
                                    label="Delivery Address"
                                    multiline
                                    rows={3}
                                    value={formik.values.deliveryAddress}
                                    onChange={formik.handleChange}
                                    error={formik.touched.deliveryAddress && Boolean(formik.errors.deliveryAddress)}
                                    helperText={formik.touched.deliveryAddress && formik.errors.deliveryAddress}
                                />
                            </Box>

                            <Box sx={{ mt: 4 }}>
                                <PaymentMethodSelector formik={formik} />
                            </Box>

                            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                                <Button
                                    variant="outlined"
                                    onClick={() => navigate('/cart')}
                                    sx={{ flex: 1 }}
                                >
                                    Back to Cart
                                </Button>
                                <Button
                                    variant="contained"
                                    type="submit"
                                    disabled={orderLoading || !formik.isValid}
                                    sx={{ flex: 1 }}
                                >
                                    {orderLoading ? 'Processing...' : 'Confirm Order'}
                                </Button>
                            </Box>
                        </form>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                    <CartSummary items={cart.items} total={cart.total_amount} />
                </Grid>
            </Grid>
        </Container>
    );
};

export default memo(Checkout); 