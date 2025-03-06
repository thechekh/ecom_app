import { memo } from 'react';
import { Typography } from '@mui/material';

interface ErrorViewProps {
    error: string | null;
}

const ErrorView = memo(({ error }: ErrorViewProps) => (
    <Typography color="error" align="center" sx={{ mt: 4 }}>
        {error || 'Post not found'}
    </Typography>
));

ErrorView.displayName = 'ErrorView';

export default ErrorView; 