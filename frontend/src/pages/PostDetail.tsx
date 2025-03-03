import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container,
    Grid,
    Typography,
    Box,
    Button,
    Paper,
    Avatar,
    IconButton,
    CircularProgress,
    Menu,
    MenuItem,
} from '@mui/material';
import {
    ShoppingCart as CartIcon,
    MoreVert as MoreVertIcon,
    NavigateBefore,
    NavigateNext,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { fetchPost, deletePost, clearSelectedPost } from '../store/slices/postsSlice';
import { addToCart } from '../store/slices/cartSlice';

const PostDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { selectedPost: post, loading, error } = useAppSelector(state => state.posts);
    const { user } = useAppSelector(state => state.auth);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [addingToCart, setAddingToCart] = useState(false);

    useEffect(() => {
        if (id) {
            dispatch(fetchPost(parseInt(id)));
        }
        return () => {
            dispatch(clearSelectedPost());
        };
    }, [id, dispatch]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Typography color="error" align="center" sx={{ mt: 4 }}>
                {error}
            </Typography>
        );
    }

    if (!post) {
        return (
            <Typography align="center" sx={{ mt: 4 }}>
                Post not found
            </Typography>
        );
    }

    const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleEdit = () => {
        handleMenuClose();
        navigate(`/posts/${post.id}/edit`);
    };

    const handleDelete = async () => {
        handleMenuClose();
        if (window.confirm('Are you sure you want to delete this post?')) {
            await dispatch(deletePost(post.id));
            navigate('/');
        }
    };

    const handleAddToCart = async () => {
        setAddingToCart(true);
        try {
            await dispatch(addToCart({ postId: post.id, quantity: 1 }));
        } finally {
            setAddingToCart(false);
        }
    };

    const handlePrevImage = () => {
        setCurrentImageIndex(prev =>
            prev > 0 ? prev - 1 : post.images.length - 1
        );
    };

    const handleNextImage = () => {
        setCurrentImageIndex(prev =>
            prev < post.images.length - 1 ? prev + 1 : 0
        );
    };

    return (
        <Container maxWidth="lg">
            <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={8}>
                        {post.images.length > 0 && (
                            <Box sx={{ position: 'relative' }}>
                                <Box
                                    component="img"
                                    src={post.images[currentImageIndex].image}
                                    alt={post.caption}
                                    sx={{
                                        width: '100%',
                                        height: 500,
                                        objectFit: 'cover',
                                        borderRadius: 1,
                                    }}
                                />
                                {post.images.length > 1 && (
                                    <>
                                        <IconButton
                                            sx={{
                                                position: 'absolute',
                                                left: 8,
                                                top: '50%',
                                                transform: 'translateY(-50%)',
                                                bgcolor: 'rgba(255, 255, 255, 0.8)',
                                                '&:hover': {
                                                    bgcolor: 'rgba(255, 255, 255, 0.9)',
                                                },
                                            }}
                                            onClick={handlePrevImage}
                                        >
                                            <NavigateBefore />
                                        </IconButton>
                                        <IconButton
                                            sx={{
                                                position: 'absolute',
                                                right: 8,
                                                top: '50%',
                                                transform: 'translateY(-50%)',
                                                bgcolor: 'rgba(255, 255, 255, 0.8)',
                                                '&:hover': {
                                                    bgcolor: 'rgba(255, 255, 255, 0.9)',
                                                },
                                            }}
                                            onClick={handleNextImage}
                                        >
                                            <NavigateNext />
                                        </IconButton>
                                    </>
                                )}
                            </Box>
                        )}
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Avatar
                                src={post.user.profile_photo}
                                alt={post.user.username}
                                sx={{ mr: 2 }}
                            >
                                {post.user.username[0].toUpperCase()}
                            </Avatar>
                            <Typography variant="subtitle1">
                                {post.user.username}
                            </Typography>
                            {user?.id === post.user.id && (
                                <>
                                    <IconButton
                                        sx={{ ml: 'auto' }}
                                        onClick={handleMenuClick}
                                    >
                                        <MoreVertIcon />
                                    </IconButton>
                                    <Menu
                                        anchorEl={anchorEl}
                                        open={Boolean(anchorEl)}
                                        onClose={handleMenuClose}
                                    >
                                        <MenuItem onClick={handleEdit}>Edit</MenuItem>
                                        <MenuItem onClick={handleDelete}>Delete</MenuItem>
                                    </Menu>
                                </>
                            )}
                        </Box>

                        <Typography variant="body1" paragraph>
                            {post.caption}
                        </Typography>

                        <Typography variant="h5" color="primary" gutterBottom>
                            ${Number(post.price).toFixed(2)}
                        </Typography>

                        <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                            Posted on {new Date(post.created_at).toLocaleDateString()}
                        </Typography>

                        {user?.id !== post.user.id && (
                            <Button
                                variant="contained"
                                startIcon={<CartIcon />}
                                fullWidth
                                onClick={handleAddToCart}
                                disabled={addingToCart}
                                sx={{ mt: 2 }}
                            >
                                {addingToCart ? 'Adding...' : 'Add to Cart'}
                            </Button>
                        )}
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    );
};

export default PostDetail; 