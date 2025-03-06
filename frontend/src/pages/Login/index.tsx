import { useEffect, memo, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Container, Paper } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { login, clearError } from '../../store/slices/authSlice';
import { LoginCredentials } from '../../types';
import LoginForm from './components/LoginForm';

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useAppDispatch();
    const { user, loading, error } = useAppSelector(state => state.auth);

    const from = location.state?.from?.pathname || '/';

    useEffect(() => {
        if (user) {
            navigate(from, { replace: true });
        }
        return () => {
            dispatch(clearError());
        };
    }, [user, navigate, from, dispatch]);

    const handleSubmit = useCallback(async (values: LoginCredentials) => {
        await dispatch(login(values));
    }, [dispatch]);

    return (
        <Container maxWidth="sm">
            <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
                <LoginForm
                    onSubmit={handleSubmit}
                    loading={loading}
                    error={error}
                />
            </Paper>
        </Container>
    );
};

export default memo(Login); 