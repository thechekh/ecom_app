import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container,
    Grid,
    Typography,
    Box,
    Button,
    IconButton,
    CircularProgress,
    AppBar,
    Toolbar,
} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { fetchPost, clearSelectedPost } from '../store/slices/postsSlice';
import { addToCart } from '../store/slices/cartSlice';

const PostDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { selectedPost: post, loading, error } = useAppSelector(state => state.posts);
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

    if (error || !post) {
        return (
            <Typography color="error" align="center" sx={{ mt: 4 }}>
                {error || 'Post not found'}
            </Typography>
        );
    }

    const handleAddToCart = async () => {
        setAddingToCart(true);
        try {
            await dispatch(addToCart({ postId: post.id, quantity: 1 }));
        } finally {
            setAddingToCart(false);
        }
    };

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <Box sx={{ bgcolor: '#ffffff', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <AppBar
                position="sticky"
                color="transparent"
                elevation={0}
                sx={{
                    borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
                    bgcolor: '#ffffff'
                }}
            >
                <Toolbar sx={{ minHeight: '44px!important' }}>
                    <IconButton
                        edge="start"
                        onClick={handleBack}
                        sx={{ color: '#000000' }}
                    >
                        <ArrowBackIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>

            <Container
                maxWidth="xs"
                sx={{
                    p: 0,
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            >
                <Box sx={{ width: '100%', maxWidth: 300 }}>
                    <Grid
                        container
                        spacing={0.5}
                        justifyContent="center"
                        alignItems="center"
                        sx={{
                            mb: 2,
                            width: '100%',
                            margin: '0 auto'
                        }}
                    >
                        {post.images.map((image, index) => (
                            <Grid
                                item
                                xs={4}
                                key={index}
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}
                            >
                                <Box
                                    component="img"
                                    src={image.image}
                                    alt={`Product ${index + 1}`}
                                    sx={{
                                        width: '100%',
                                        aspectRatio: '1',
                                        objectFit: 'cover',
                                    }}
                                />
                            </Grid>
                        ))}
                    </Grid>

                    <Box sx={{ px: 2, py: 2 }}>
                        <Typography variant="h6" sx={{ fontSize: '16px', fontWeight: 400, textAlign: 'center' }}>
                            {post.caption}
                        </Typography>

                        <Typography variant="h6" sx={{ fontSize: '16px', fontWeight: 600, textAlign: 'center', mt: 1 }}>
                            ${Number(post.price).toFixed(2)}
                        </Typography>

                        <Typography
                            variant="body2"
                            sx={{
                                fontSize: '12px',
                                color: 'text.secondary',
                                mt: 1,
                                textAlign: 'center'
                            }}
                        >
                            {post.user.username}
                        </Typography>

                        <Button
                            variant="contained"
                            fullWidth
                            onClick={handleAddToCart}
                            disabled={addingToCart}
                            sx={{
                                mt: 2,
                                textTransform: 'none',
                                py: 1,
                                bgcolor: '#0095f6',
                                '&:hover': {
                                    bgcolor: '#1877f2'
                                },
                                fontSize: '14px',
                                fontWeight: 600
                            }}
                        >
                            {addingToCart ? 'Adding...' : 'Add to Cart'}
                        </Button>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};

export default PostDetail; 