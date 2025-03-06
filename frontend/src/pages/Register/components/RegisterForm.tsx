import { memo } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
    Box,
    Typography,
    TextField,
    Button,
    Link,
    Grid,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import FormError from '../../../components/FormError';
import { RegisterData } from '../../../types';

const validationSchema = Yup.object({
    username: Yup.string()
        .min(3, 'Username must be at least 3 characters')
        .required('Username is required'),
    email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
    password: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .required('Password is required'),
    password2: Yup.string()
        .oneOf([Yup.ref('password')], 'Passwords must match')
        .required('Please confirm your password'),
    first_name: Yup.string().required('First name is required'),
    last_name: Yup.string().required('Last name is required'),
});

interface RegisterFormProps {
    onSubmit: (values: RegisterData) => Promise<void>;
    loading: boolean;
    error: string | null;
}

const RegisterForm = memo(({ onSubmit, loading, error }: RegisterFormProps) => {
    const formik = useFormik({
        initialValues: {
            username: '',
            email: '',
            password: '',
            password2: '',
            first_name: '',
            last_name: '',
        },
        validationSchema,
        onSubmit,
    });

    return (
        <Box component="form" onSubmit={formik.handleSubmit} noValidate sx={{ mt: 1 }}>
            <Typography component="h1" variant="h5" align="center" gutterBottom>
                Sign Up
            </Typography>

            <FormError error={error} />

            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <TextField
                        required
                        fullWidth
                        id="first_name"
                        label="First Name"
                        name="first_name"
                        autoComplete="given-name"
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
                        id="last_name"
                        label="Last Name"
                        name="last_name"
                        autoComplete="family-name"
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
                        id="username"
                        label="Username"
                        name="username"
                        autoComplete="username"
                        value={formik.values.username}
                        onChange={formik.handleChange}
                        error={formik.touched.username && Boolean(formik.errors.username)}
                        helperText={formik.touched.username && formik.errors.username}
                        disabled={loading}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
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
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="new-password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        error={formik.touched.password && Boolean(formik.errors.password)}
                        helperText={formik.touched.password && formik.errors.password}
                        disabled={loading}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        required
                        fullWidth
                        name="password2"
                        label="Confirm Password"
                        type="password"
                        id="password2"
                        autoComplete="new-password"
                        value={formik.values.password2}
                        onChange={formik.handleChange}
                        error={formik.touched.password2 && Boolean(formik.errors.password2)}
                        helperText={formik.touched.password2 && formik.errors.password2}
                        disabled={loading}
                    />
                </Grid>
            </Grid>

            <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading}
            >
                {loading ? 'Signing up...' : 'Sign Up'}
            </Button>

            <Box sx={{ textAlign: 'center' }}>
                <Link component={RouterLink} to="/login" variant="body2">
                    Already have an account? Sign in
                </Link>
            </Box>
        </Box>
    );
});

RegisterForm.displayName = 'RegisterForm';

export default RegisterForm; 