import { memo } from 'react';
import { Typography, Box, Button } from '@mui/material';
import { Post } from '../../../types';

interface PostInfoProps {
    post: Post;
    onAddToCart: () => void;
    addingToCart: boolean;
}

const PostInfo = memo(({ post, onAddToCart, addingToCart }: PostInfoProps) => (
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
            onClick={onAddToCart}
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
));

PostInfo.displayName = 'PostInfo';

export default PostInfo; 