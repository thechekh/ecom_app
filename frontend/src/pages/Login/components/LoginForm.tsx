import { memo } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
    Box,
    Typography,
    TextField,
    Button,
    Link,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import FormError from '../../../components/FormError';
import { LoginCredentials } from '../../../types';

const validationSchema = Yup.object({
    username: Yup.string().required('Username is required'),
    password: Yup.string().required('Password is required'),
});

interface LoginFormProps {
    onSubmit: (values: LoginCredentials) => Promise<void>;
    loading: boolean;
    error: string | null;
}

const LoginForm = memo(({ onSubmit, loading, error }: LoginFormProps) => {
    const formik = useFormik({
        initialValues: {
            username: '',
            password: '',
        },
        validationSchema,
        onSubmit,
    });

    return (
        <Box component="form" onSubmit={formik.handleSubmit} noValidate sx={{ mt: 1 }}>
            <Typography component="h1" variant="h5" align="center" gutterBottom>
                Sign In
            </Typography>

            <FormError error={error} />

            <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                autoFocus
                value={formik.values.username}
                onChange={formik.handleChange}
                error={formik.touched.username && Boolean(formik.errors.username)}
                helperText={formik.touched.username && formik.errors.username}
                disabled={loading}
            />

            <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={formik.values.password}
                onChange={formik.handleChange}
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password}
                disabled={loading}
            />

            <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading}
            >
                {loading ? 'Signing in...' : 'Sign In'}
            </Button>

            <Box sx={{ textAlign: 'center' }}>
                <Link component={RouterLink} to="/register" variant="body2">
                    {"Don't have an account? Sign Up"}
                </Link>
            </Box>
        </Box>
    );
});

LoginForm.displayName = 'LoginForm';

export default LoginForm; 