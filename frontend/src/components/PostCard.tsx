import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Card,
    CardHeader,
    CardMedia,
    CardContent,
    CardActions,
    Avatar,
    IconButton,
    Typography,
    Button,
    Box,
    Menu,
    MenuItem,
} from '@mui/material';
import {
    MoreVert as MoreVertIcon,
    ShoppingCart as CartIcon,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { addToCart } from '../store/slices/cartSlice';
import { deletePost } from '../store/slices/postsSlice';
import { Post } from '../types';

interface PostCardProps {
    post: Post;
}

const PostCard = ({ post }: PostCardProps) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { user } = useAppSelector(state => state.auth);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [loading, setLoading] = useState(false);

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
        }
    };

    const handleAddToCart = async () => {
        setLoading(true);
        try {
            await dispatch(addToCart({ postId: post.id, quantity: 1 }));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader
                avatar={
                    <Avatar
                        src={post.user.profile_photo}
                        alt={post.user.username}
                    >
                        {post.user.username[0].toUpperCase()}
                    </Avatar>
                }
                action={
                    user?.id === post.user.id && (
                        <>
                            <IconButton onClick={handleMenuClick}>
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
                    )
                }
                title={post.user.username}
                subheader={new Date(post.created_at).toLocaleDateString()}
            />
            {post.images.length > 0 && (
                <CardMedia
                    component="img"
                    height="300"
                    image={post.images[0].image}
                    alt={post.caption}
                    sx={{ objectFit: 'cover', cursor: 'pointer' }}
                    onClick={() => navigate(`/posts/${post.id}`)}
                />
            )}
            <CardContent>
                <Typography variant="body2" color="text.secondary">
                    {post.caption}
                </Typography>
                <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                    ${Number(post.price).toFixed(2)}
                </Typography>
            </CardContent>
            <CardActions disableSpacing>
                <Box sx={{ ml: 'auto' }}>
                    <Button
                        variant="contained"
                        startIcon={<CartIcon />}
                        onClick={handleAddToCart}
                        disabled={loading}
                    >
                        {loading ? 'Adding...' : 'Add to Cart'}
                    </Button>
                </Box>
            </CardActions>
        </Card>
    );
};

export default PostCard; 