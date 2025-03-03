import { useState, useEffect } from 'react';
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
    Stepper,
    Step,
    StepLabel,
    CircularProgress,
    Card,
    CardContent,
    Divider,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { fetchCart } from '../store/slices/cartSlice';
import { checkout } from '../store/slices/ordersSlice';
import FormError from '../components/FormError';

const steps = ['Shipping Address', 'Payment', 'Review'];

const validationSchema = Yup.object({
    shipping_address: Yup.object({
        street_address: Yup.string().required('Street address is required'),
        city: Yup.string().required('City is required'),
        state: Yup.string().required('State is required'),
        postal_code: Yup.string().required('Postal code is required'),
        country: Yup.string().required('Country is required'),
    }),
    payment: Yup.object({
        card_number: Yup.string()
            .required('Card number is required')
            .matches(/^\d{16}$/, 'Card number must be 16 digits'),
        expiry_month: Yup.string()
            .required('Expiry month is required')
            .matches(/^(0[1-9]|1[0-2])$/, 'Invalid expiry month'),
        expiry_year: Yup.string()
            .required('Expiry year is required')
            .matches(/^\d{4}$/, 'Invalid expiry year'),
        cvv: Yup.string()
            .required('CVV is required')
            .matches(/^\d{3,4}$/, 'Invalid CVV'),
    }),
});

const Checkout = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { cart, loading: cartLoading } = useAppSelector(state => state.cart);
    const { loading: orderLoading, error } = useAppSelector(state => state.orders);
    const [activeStep, setActiveStep] = useState(0);

    useEffect(() => {
        dispatch(fetchCart());
    }, [dispatch]);

    const formik = useFormik({
        initialValues: {
            shipping_address: {
                street_address: '',
                city: '',
                state: '',
                postal_code: '',
                country: '',
            },
            payment: {
                card_number: '',
                expiry_month: '',
                expiry_year: '',
                cvv: '',
            },
        },
        validationSchema,
        onSubmit: async (values) => {
            const shippingAddress = `${values.shipping_address.street_address}, ${values.shipping_address.city}, ${values.shipping_address.state} ${values.shipping_address.postal_code}, ${values.shipping_address.country}`;

            const orderData = {
                payment_method: 'bank',
                shipping_address: shippingAddress
            };

            const result = await dispatch(checkout(orderData));
            if (checkout.fulfilled.match(result)) {
                navigate(`/orders/${result.payload.id}`);
            } else {
                setActiveStep(activeStep);
            }
        },
    });

    const handleNext = () => {
        if (activeStep === steps.length - 1) {
            formik.submitForm();
        } else {
            setActiveStep((prevStep) => prevStep + 1);
        }
    };

    const handleBack = () => {
        setActiveStep((prevStep) => prevStep - 1);
    };

    if (cartLoading || !cart) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!cart.items.length) {
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

    const renderStepContent = (step: number) => {
        switch (step) {
            case 0:
                return (
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                name="shipping_address.street_address"
                                label="Street Address"
                                value={formik.values.shipping_address.street_address}
                                onChange={formik.handleChange}
                                error={
                                    formik.touched.shipping_address?.street_address &&
                                    Boolean(formik.errors.shipping_address?.street_address)
                                }
                                helperText={
                                    formik.touched.shipping_address?.street_address &&
                                    formik.errors.shipping_address?.street_address
                                }
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                name="shipping_address.city"
                                label="City"
                                value={formik.values.shipping_address.city}
                                onChange={formik.handleChange}
                                error={
                                    formik.touched.shipping_address?.city &&
                                    Boolean(formik.errors.shipping_address?.city)
                                }
                                helperText={
                                    formik.touched.shipping_address?.city &&
                                    formik.errors.shipping_address?.city
                                }
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                name="shipping_address.state"
                                label="State"
                                value={formik.values.shipping_address.state}
                                onChange={formik.handleChange}
                                error={
                                    formik.touched.shipping_address?.state &&
                                    Boolean(formik.errors.shipping_address?.state)
                                }
                                helperText={
                                    formik.touched.shipping_address?.state &&
                                    formik.errors.shipping_address?.state
                                }
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                name="shipping_address.postal_code"
                                label="Postal Code"
                                value={formik.values.shipping_address.postal_code}
                                onChange={formik.handleChange}
                                error={
                                    formik.touched.shipping_address?.postal_code &&
                                    Boolean(formik.errors.shipping_address?.postal_code)
                                }
                                helperText={
                                    formik.touched.shipping_address?.postal_code &&
                                    formik.errors.shipping_address?.postal_code
                                }
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                name="shipping_address.country"
                                label="Country"
                                value={formik.values.shipping_address.country}
                                onChange={formik.handleChange}
                                error={
                                    formik.touched.shipping_address?.country &&
                                    Boolean(formik.errors.shipping_address?.country)
                                }
                                helperText={
                                    formik.touched.shipping_address?.country &&
                                    formik.errors.shipping_address?.country
                                }
                            />
                        </Grid>
                    </Grid>
                );
            case 1:
                return (
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                name="payment.card_number"
                                label="Card Number"
                                value={formik.values.payment.card_number}
                                onChange={formik.handleChange}
                                error={
                                    formik.touched.payment?.card_number &&
                                    Boolean(formik.errors.payment?.card_number)
                                }
                                helperText={
                                    formik.touched.payment?.card_number &&
                                    formik.errors.payment?.card_number
                                }
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                name="payment.expiry_month"
                                label="Expiry Month (MM)"
                                value={formik.values.payment.expiry_month}
                                onChange={formik.handleChange}
                                error={
                                    formik.touched.payment?.expiry_month &&
                                    Boolean(formik.errors.payment?.expiry_month)
                                }
                                helperText={
                                    formik.touched.payment?.expiry_month &&
                                    formik.errors.payment?.expiry_month
                                }
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                name="payment.expiry_year"
                                label="Expiry Year (YYYY)"
                                value={formik.values.payment.expiry_year}
                                onChange={formik.handleChange}
                                error={
                                    formik.touched.payment?.expiry_year &&
                                    Boolean(formik.errors.payment?.expiry_year)
                                }
                                helperText={
                                    formik.touched.payment?.expiry_year &&
                                    formik.errors.payment?.expiry_year
                                }
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                name="payment.cvv"
                                label="CVV"
                                value={formik.values.payment.cvv}
                                onChange={formik.handleChange}
                                error={
                                    formik.touched.payment?.cvv &&
                                    Boolean(formik.errors.payment?.cvv)
                                }
                                helperText={
                                    formik.touched.payment?.cvv &&
                                    formik.errors.payment?.cvv
                                }
                            />
                        </Grid>
                    </Grid>
                );
            case 2:
                return (
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Shipping Address
                                    </Typography>
                                    <Typography>
                                        {formik.values.shipping_address.street_address}
                                    </Typography>
                                    <Typography>
                                        {formik.values.shipping_address.city},{' '}
                                        {formik.values.shipping_address.state}{' '}
                                        {formik.values.shipping_address.postal_code}
                                    </Typography>
                                    <Typography>
                                        {formik.values.shipping_address.country}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Order Summary
                                    </Typography>
                                    {cart.items.map((item) => (
                                        <Box key={item.id} sx={{ mb: 2 }}>
                                            <Grid container spacing={2}>
                                                <Grid item xs={8}>
                                                    <Typography>
                                                        {item.post.caption} x {item.quantity}
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={4}>
                                                    <Typography align="right">
                                                        ${(item.post.price * item.quantity).toFixed(2)}
                                                    </Typography>
                                                </Grid>
                                            </Grid>
                                        </Box>
                                    ))}
                                    <Divider sx={{ my: 2 }} />
                                    <Grid container spacing={2}>
                                        <Grid item xs={8}>
                                            <Typography variant="h6">Total</Typography>
                                        </Grid>
                                        <Grid item xs={4}>
                                            <Typography variant="h6" align="right">
                                                ${cart.total_amount.toFixed(2)}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                );
            default:
                return null;
        }
    };

    return (
        <Container maxWidth="md">
            <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
                <Typography component="h1" variant="h4" align="center" gutterBottom>
                    Checkout
                </Typography>

                <FormError error={error} />

                <Stepper activeStep={activeStep} sx={{ py: 3 }}>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>

                <Box sx={{ mt: 2 }}>
                    {renderStepContent(activeStep)}
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                        {activeStep !== 0 && (
                            <Button onClick={handleBack} sx={{ mr: 1 }}>
                                Back
                            </Button>
                        )}
                        <Button
                            variant="contained"
                            onClick={handleNext}
                            disabled={orderLoading}
                        >
                            {activeStep === steps.length - 1 ? 'Place Order' : 'Next'}
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
};

export default Checkout; 