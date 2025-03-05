import { useState, useEffect, ChangeEvent } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
    Container,
    Box,
    Typography,
    TextField,
    Button,
    Paper,
    Avatar,
    Grid,
    IconButton,
    Snackbar,
    Alert,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { updateProfile, clearError } from '../store/slices/authSlice';
import FormError from '../components/FormError';

const validationSchema = Yup.object({
    first_name: Yup.string().required('First name is required'),
    last_name: Yup.string().required('Last name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    phone: Yup.string().required('Phone number is required'),
    delivery_address: Yup.string().required('Delivery address is required'),
    preferred_payment_method: Yup.string().required('Payment method is required'),
});

const Profile = () => {
    const dispatch = useAppDispatch();
    const { user, loading, error } = useAppSelector(state => state.auth);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        return () => {
            dispatch(clearError());
        };
    }, [dispatch]);

    const handleCloseSnackbar = () => {
        setShowSuccess(false);
    };

    const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            setSelectedImage(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const formik = useFormik({
        initialValues: {
            first_name: user?.first_name || '',
            last_name: user?.last_name || '',
            email: user?.email || '',
            phone: user?.phone || '',
            delivery_address: user?.delivery_address || '',
            preferred_payment_method: user?.preferred_payment_method || 'bank',
        },
        validationSchema,
        enableReinitialize: true,
        onSubmit: async (values) => {
            const formData = new FormData();
            formData.append('first_name', values.first_name);
            formData.append('last_name', values.last_name);
            formData.append('email', values.email);
            formData.append('phone', values.phone);
            formData.append('delivery_address', values.delivery_address);
            formData.append('preferred_payment_method', values.preferred_payment_method);
            if (selectedImage) {
                formData.append('profile_photo', selectedImage);
            }
            const result = await dispatch(updateProfile(formData));
            if (!result.type.endsWith('rejected')) {
                setShowSuccess(true);
            }
        },
    });

    return (
        <Container maxWidth="sm">
            <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
                <Box
                    component="form"
                    onSubmit={formik.handleSubmit}
                    noValidate
                    sx={{ mt: 1 }}
                >
                    <Typography component="h1" variant="h5" align="center" gutterBottom>
                        Profile
                    </Typography>

                    <FormError error={error} />

                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                        <Box sx={{ position: 'relative' }}>
                            <Avatar
                                src={previewUrl || user?.profile_photo}
                                sx={{ width: 100, height: 100 }}
                            />
                            <IconButton
                                color="primary"
                                aria-label="upload picture"
                                component="label"
                                sx={{
                                    position: 'absolute',
                                    bottom: -10,
                                    right: -10,
                                    backgroundColor: 'white',
                                }}
                            >
                                <input
                                    hidden
                                    accept="image/*"
                                    type="file"
                                    onChange={handleImageChange}
                                    disabled={loading}
                                />
                                <PhotoCamera />
                            </IconButton>
                        </Box>
                    </Box>

                    <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                        Personal Information
                    </Typography>

                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                name="first_name"
                                label="First Name"
                                value={formik.values.first_name}
                                onChange={formik.handleChange}
                                error={formik.touched.first_name && Boolean(formik.errors.first_name)}
                                helperText={formik.touched.first_name && formik.errors.first_name}
                                disabled={loading}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                name="last_name"
                                label="Last Name"
                                value={formik.values.last_name}
                                onChange={formik.handleChange}
                                error={formik.touched.last_name && Boolean(formik.errors.last_name)}
                                helperText={formik.touched.last_name && formik.errors.last_name}
                                disabled={loading}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                name="email"
                                label="Email"
                                type="email"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                error={formik.touched.email && Boolean(formik.errors.email)}
                                helperText={formik.touched.email && formik.errors.email}
                                disabled={loading}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                name="phone"
                                label="Phone Number"
                                value={formik.values.phone}
                                onChange={formik.handleChange}
                                error={formik.touched.phone && Boolean(formik.errors.phone)}
                                helperText={formik.touched.phone && formik.errors.phone}
                                disabled={loading}
                            />
                        </Grid>
                    </Grid>

                    <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
                        Delivery Information
                    </Typography>

                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                name="delivery_address"
                                label="Delivery Address"
                                multiline
                                rows={3}
                                value={formik.values.delivery_address}
                                onChange={formik.handleChange}
                                error={formik.touched.delivery_address && Boolean(formik.errors.delivery_address)}
                                helperText={formik.touched.delivery_address && formik.errors.delivery_address}
                                disabled={loading}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth required>
                                <InputLabel>Preferred Payment Method</InputLabel>
                                <Select
                                    name="preferred_payment_method"
                                    value={formik.values.preferred_payment_method}
                                    label="Preferred Payment Method"
                                    onChange={formik.handleChange}
                                    error={formik.touched.preferred_payment_method && Boolean(formik.errors.preferred_payment_method)}
                                    disabled={loading}
                                >
                                    <MenuItem value="bank">To the seller's bank account</MenuItem>
                                    <MenuItem value="stripe">Stripe</MenuItem>
                                    <MenuItem value="google_pay">Google Pay</MenuItem>
                                    <MenuItem value="apple_pay">Apple Pay</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3 }}
                        disabled={loading}
                    >
                        {loading ? 'Saving...' : 'Save Changes'}
                    </Button>
                </Box>
            </Paper>

            <Snackbar
                open={showSuccess}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity="success"
                    sx={{ width: '100%' }}
                >
                    Profile updated successfully!
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default Profile; 