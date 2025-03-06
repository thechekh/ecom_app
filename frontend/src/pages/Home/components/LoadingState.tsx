import { memo } from 'react';
import { Box, CircularProgress } from '@mui/material';

const LoadingState = memo(() => (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
    </Box>
));

LoadingState.displayName = 'LoadingState';

export default LoadingState; 