import { memo } from 'react';
import { Container, Typography, Paper } from '@mui/material';

interface EmptyStateProps {
    message: string;
}

const EmptyState = memo(({ message }: EmptyStateProps) => (
    <Container maxWidth="md">
        <Paper elevation={3} sx={{ p: 3, mt: 4, textAlign: 'center' }}>
            <Typography variant="h5" gutterBottom>
                {message}
            </Typography>
        </Paper>
    </Container>
));

export default EmptyState; 