import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
    Container,
    Paper,
    Typography,
    Box,
    Grid,
    TextField,
    Button,
    CircularProgress,
    Divider,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    FormLabel,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { fetchCart } from '../store/slices/cartSlice';
import { checkout } from '../store/slices/ordersSlice';
import FormError from '../components/FormError';

const validationSchema = Yup.object({
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    phone: Yup.string().required('Phone number is required'),
    deliveryAddress: Yup.string().required('Delivery address is required'),
    paymentMethod: Yup.string().required('Payment method is required'),
});

const Checkout = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { cart, loading: cartLoading } = useAppSelector(state => state.cart);
    const { loading: orderLoading, error } = useAppSelector(state => state.orders);
    const { user } = useAppSelector(state => state.auth);
    const [submitError, setSubmitError] = useState<string | null>(null);

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
        onSubmit: async (values) => {
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
                console.log('Submitting order with data:', orderData);
                const result = await dispatch(checkout(orderData)).unwrap();
                console.log('Order creation response:', result);

                if (result && result.id) {
                    navigate(`/orders/${result.id}`);
                } else {
                    setSubmitError('Invalid response from server');
                }
            } catch (error: any) {
                console.error('Checkout failed:', error);
                setSubmitError(
                    error.response?.data?.detail ||
                    error.message ||
                    'Failed to create order. Please try again.'
                );
            }
        },
    });

    if (cartLoading || !cart) {
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
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Grid container spacing={4}>
                {/* Left Column - Contact Details */}
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
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        name="firstName"
                                        label="First Name"
                                        value={formik.values.firstName}
                                        onChange={formik.handleChange}
                                        error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                                        helperText={formik.touched.firstName && formik.errors.firstName}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        name="lastName"
                                        label="Last Name"
                                        value={formik.values.lastName}
                                        onChange={formik.handleChange}
                                        error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                                        helperText={formik.touched.lastName && formik.errors.lastName}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        name="phone"
                                        label="Phone Number"
                                        value={formik.values.phone}
                                        onChange={formik.handleChange}
                                        error={formik.touched.phone && Boolean(formik.errors.phone)}
                                        helperText={formik.touched.phone && formik.errors.phone}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        name="email"
                                        label="Email"
                                        type="email"
                                        value={formik.values.email}
                                        onChange={formik.handleChange}
                                        error={formik.touched.email && Boolean(formik.errors.email)}
                                        helperText={formik.touched.email && formik.errors.email}
                                    />
                                </Grid>
                            </Grid>

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
                                <FormControl component="fieldset" fullWidth>
                                    <FormLabel component="legend">Payment Method</FormLabel>
                                    <RadioGroup
                                        name="paymentMethod"
                                        value={formik.values.paymentMethod}
                                        onChange={formik.handleChange}
                                    >
                                        <FormControlLabel
                                            value="bank"
                                            control={<Radio />}
                                            label="To the seller's bank account"
                                        />
                                        <FormControlLabel
                                            value="stripe"
                                            control={<Radio />}
                                            label="Stripe"
                                        />
                                        <FormControlLabel
                                            value="google_pay"
                                            control={<Radio />}
                                            label="Google Pay"
                                        />
                                        <FormControlLabel
                                            value="apple_pay"
                                            control={<Radio />}
                                            label="Apple Pay"
                                        />
                                    </RadioGroup>
                                </FormControl>
                            </Box>

                            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                                <Button
                                    variant="outlined"
                                    type="button"
                                    onClick={() => navigate('/cart')}
                                    sx={{ flex: 1 }}
                                >
                                    Go back shopping
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

                {/* Right Column - Cart Details */}
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Cart Details
                        </Typography>

                        <Box sx={{ mt: 2 }}>
                            {cart.items.map((item) => (
                                <Box key={item.id} sx={{ mb: 2 }}>
                                    <Grid container spacing={2} alignItems="center">
                                        <Grid item xs={2}>
                                            <Box
                                                component="img"
                                                src={item.post.images[0]?.image}
                                                alt={item.post.caption}
                                                sx={{
                                                    width: '100%',
                                                    aspectRatio: '1',
                                                    objectFit: 'cover',
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="subtitle2">
                                                {item.post.caption}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Quantity: {item.quantity}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={4}>
                                            <Typography variant="subtitle2" align="right">
                                                ${(item.post.price * item.quantity).toFixed(2)}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Box>
                            ))}
                        </Box>

                        <Divider sx={{ my: 3 }} />

                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Typography variant="h6">Total</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="h6" align="right">
                                    ${cart.total_amount.toFixed(2)}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default Checkout; 