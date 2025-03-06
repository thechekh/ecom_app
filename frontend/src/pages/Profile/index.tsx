import { useState, useEffect, ChangeEvent, memo, useCallback } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
    Container,
    Box,
    Typography,
    Button,
    Paper,
    Snackbar,
    Alert,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { updateProfile, clearError } from '../../store/slices/authSlice';
import FormError from '../../components/FormError';
import ProfilePhoto from './components/ProfilePhoto';
import PersonalInfo from './components/PersonalInfo';
import DeliveryInfo from './components/DeliveryInfo';

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
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
            dispatch(clearError());
        };
    }, [dispatch, previewUrl]);

    const handleCloseSnackbar = useCallback(() => {
        setShowSuccess(false);
    }, []);

    const handleImageChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            setSelectedImage(file);
            const newPreviewUrl = URL.createObjectURL(file);
            setPreviewUrl(prevUrl => {
                if (prevUrl) {
                    URL.revokeObjectURL(prevUrl);
                }
                return newPreviewUrl;
            });
        }
    }, []);

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

                    <ProfilePhoto
                        previewUrl={previewUrl}
                        profilePhoto={user?.profile_photo}
                        onImageChange={handleImageChange}
                        loading={loading}
                    />

                    <PersonalInfo formik={formik} loading={loading} />
                    <DeliveryInfo formik={formik} loading={loading} />

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

export default memo(Profile); 