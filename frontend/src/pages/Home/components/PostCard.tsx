import React, { useState, memo, useCallback } from 'react';
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
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    DialogContentText,
} from '@mui/material';
import {
    MoreVert as MoreVertIcon,
    ShoppingCart as CartIcon,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import { addToCart } from '../../../store/slices/cartSlice';
import { deletePost } from '../../../store/slices/postsSlice';
import { Post } from '../../../types';

interface PostCardProps {
    post: Post;
}

const PostCard: React.FC<PostCardProps> = memo(({ post }) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { user } = useAppSelector(state => state.auth);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [loading, setLoading] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const handleMenuClick = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    }, []);

    const handleMenuClose = useCallback(() => {
        setAnchorEl(null);
    }, []);

    const handleEdit = useCallback(() => {
        handleMenuClose();
        navigate(`/posts/${post.id}/edit`);
    }, [navigate, post.id, handleMenuClose]);

    const handleDeleteClick = useCallback(() => {
        handleMenuClose();
        setDeleteDialogOpen(true);
    }, [handleMenuClose]);

    const handleDeleteCancel = useCallback(() => {
        setDeleteDialogOpen(false);
    }, []);

    const handleDeleteConfirm = useCallback(async () => {
        setDeleteDialogOpen(false);
        await dispatch(deletePost(post.id));
    }, [dispatch, post.id]);

    const handleAddToCart = useCallback(async () => {
        setLoading(true);
        try {
            await dispatch(addToCart({ postId: post.id, quantity: 1 }));
        } finally {
            setLoading(false);
        }
    }, [dispatch, post.id]);

    const handleImageClick = useCallback(() => {
        navigate(`/posts/${post.id}`);
    }, [navigate, post.id]);

    const menuOpen = Boolean(anchorEl);
    const isOwner = user?.id === post.user.id;
    const formattedPrice = `$${Number(post.price).toFixed(2)}`;
    const formattedDate = new Date(post.created_at).toLocaleDateString();
    const avatarLetter = post.user.username[0].toUpperCase();

    return (
        <>
            <Card>
                <CardHeader
                    avatar={
                        <Avatar
                            src={post.user.profile_photo}
                            alt={post.user.username}
                        >
                            {avatarLetter}
                        </Avatar>
                    }
                    action={
                        isOwner && (
                            <>
                                <IconButton onClick={handleMenuClick}>
                                    <MoreVertIcon />
                                </IconButton>
                                <Menu
                                    anchorEl={anchorEl}
                                    open={menuOpen}
                                    onClose={handleMenuClose}
                                >
                                    <MenuItem onClick={handleEdit}>Edit</MenuItem>
                                    <MenuItem onClick={handleDeleteClick}>Delete</MenuItem>
                                </Menu>
                            </>
                        )
                    }
                    title={post.user.username}
                    subheader={formattedDate}
                />
                {post.images.length > 0 && (
                    <CardMedia
                        component="img"
                        height="300"
                        image={post.images[0].image}
                        alt={post.caption}
                        sx={{ objectFit: 'cover', cursor: 'pointer' }}
                        onClick={handleImageClick}
                    />
                )}
                <CardContent>
                    <Typography variant="body2" color="text.secondary">
                        {post.caption}
                    </Typography>
                    <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                        {formattedPrice}
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

            <Dialog
                open={deleteDialogOpen}
                onClose={handleDeleteCancel}
            >
                <DialogTitle>Delete Post</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this post? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteCancel} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleDeleteConfirm} color="error" autoFocus>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
});

PostCard.displayName = 'PostCard';

export default PostCard; 