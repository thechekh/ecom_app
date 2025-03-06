import { memo } from 'react';
import { Box, CircularProgress } from '@mui/material';

interface LoadingOverlayProps {
    loading: boolean;
}

const LoadingOverlay = memo(({ loading }: LoadingOverlayProps) => {
    if (!loading) return null;

    return (
        <Box
            sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'rgba(255, 255, 255, 0.7)',
                zIndex: 1,
            }}
        >
            <CircularProgress size={24} />
        </Box>
    );
});

LoadingOverlay.displayName = 'LoadingOverlay';

export default LoadingOverlay; 