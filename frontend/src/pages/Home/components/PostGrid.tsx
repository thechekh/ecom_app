import { memo } from 'react';
import { Grid } from '@mui/material';
import PostCard from './PostCard';
import { Post } from '../../../types';

interface PostGridProps {
    posts: Post[];
}

const PostGrid = memo(({ posts }: PostGridProps) => (
    <Grid container spacing={3}>
        {posts.map(post => (
            <Grid item xs={12} sm={6} md={4} key={post.id}>
                <PostCard post={post} />
            </Grid>
        ))}
    </Grid>
));

PostGrid.displayName = 'PostGrid';

export default PostGrid; 