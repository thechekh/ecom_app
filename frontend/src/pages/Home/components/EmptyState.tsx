import { memo } from 'react';
import { Typography } from '@mui/material';

const EmptyState = memo(() => (
    <Typography align="center" color="textSecondary" sx={{ mt: 4 }}>
        No posts found
    </Typography>
));

EmptyState.displayName = 'EmptyState';

export default EmptyState; 