import { useEffect, useState, memo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Container } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { fetchPost, clearSelectedPost } from '../../store/slices/postsSlice';
import { addToCart } from '../../store/slices/cartSlice';
import LoadingOverlay from '../../components/LoadingOverlay';
import PostHeader from './components/PostHeader';
import ImageGallery from './components/ImageGallery';
import PostInfo from './components/PostInfo';
import ErrorView from './components/ErrorView';

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

    const handleAddToCart = useCallback(async () => {
        if (!post) return;
        setAddingToCart(true);
        try {
            await dispatch(addToCart({ postId: post.id, quantity: 1 }));
        } finally {
            setAddingToCart(false);
        }
    }, [dispatch, post]);

    const handleBack = useCallback(() => {
        navigate(-1);
    }, [navigate]);

    if (error || !post) {
        return <ErrorView error={error} />;
    }

    return (
        <Box sx={{ bgcolor: '#ffffff', minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
            <LoadingOverlay loading={loading} />
            <PostHeader onBack={handleBack} />

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
                    <ImageGallery images={post.images} />
                    <PostInfo
                        post={post}
                        onAddToCart={handleAddToCart}
                        addingToCart={addingToCart}
                    />
                </Box>
            </Container>
        </Box>
    );
};

export default memo(PostDetail); 