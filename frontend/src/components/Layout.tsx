import { ReactNode } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
    AppBar,
    Box,
    Container,
    Toolbar,
    Typography,
    Button,
    IconButton,
    Badge,
    Menu,
    MenuItem,
    Link,
} from '@mui/material';
import {
    ShoppingCart as CartIcon,
    AccountCircle as AccountIcon,
    Menu as MenuIcon,
} from '@mui/icons-material';
import { useAppSelector, useAppDispatch } from '../hooks/redux';
import { logout } from '../store/slices/authSlice';

interface LayoutProps {
    children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { user } = useAppSelector(state => state.auth);
    const { cart } = useAppSelector(state => state.cart);

    const handleLogout = async () => {
        await dispatch(logout());
        navigate('/login');
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <AppBar position="static">
                <Container maxWidth="lg">
                    <Toolbar>
                        <Typography
                            variant="h6"
                            component={RouterLink}
                            to="/"
                            sx={{
                                flexGrow: 1,
                                textDecoration: 'none',
                                color: 'inherit',
                            }}
                        >
                            E-commerce
                        </Typography>

                        {user ? (
                            <>
                                <Button
                                    color="inherit"
                                    component={RouterLink}
                                    to="/posts/create"
                                >
                                    Create Post
                                </Button>
                                <IconButton
                                    color="inherit"
                                    component={RouterLink}
                                    to="/cart"
                                >
                                    <Badge
                                        badgeContent={cart?.items?.length || 0}
                                        color="error"
                                    >
                                        <CartIcon />
                                    </Badge>
                                </IconButton>
                                <Button
                                    color="inherit"
                                    component={RouterLink}
                                    to="/orders"
                                >
                                    Orders
                                </Button>
                                <Button
                                    color="inherit"
                                    component={RouterLink}
                                    to="/profile"
                                >
                                    Profile
                                </Button>
                                <Button
                                    color="inherit"
                                    onClick={handleLogout}
                                >
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button
                                    color="inherit"
                                    component={RouterLink}
                                    to="/login"
                                >
                                    Login
                                </Button>
                                <Button
                                    color="inherit"
                                    component={RouterLink}
                                    to="/register"
                                >
                                    Register
                                </Button>
                            </>
                        )}
                    </Toolbar>
                </Container>
            </AppBar>

            <Container
                component="main"
                maxWidth="lg"
                sx={{
                    mt: 4,
                    mb: 4,
                    flex: '1 0 auto',
                }}
            >
                {children}
            </Container>

            <Box
                component="footer"
                sx={{
                    py: 3,
                    px: 2,
                    mt: 'auto',
                    backgroundColor: (theme) =>
                        theme.palette.mode === 'light'
                            ? theme.palette.grey[200]
                            : theme.palette.grey[800],
                }}
            >
                <Container maxWidth="lg">
                    <Typography variant="body2" color="text.secondary" align="center">
                        © {new Date().getFullYear()} Django React Shop App
                    </Typography>
                </Container>
            </Box>
        </Box>
    );
};

export default Layout; 