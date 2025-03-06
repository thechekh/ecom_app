import { memo } from 'react';
import { Container, Typography, Paper, Button } from '@mui/material';

interface ErrorViewProps {
    error: string | null | undefined;
    onBack: () => void;
}

const ErrorView = memo(({ error, onBack }: ErrorViewProps) => (
    <Container maxWidth="md">
        <Paper elevation={3} sx={{ p: 3, mt: 4, textAlign: 'center' }}>
            <Typography variant="h5" gutterBottom color="error">
                {error || 'Order not found'}
            </Typography>
            <Button
                variant="contained"
                onClick={onBack}
                sx={{ mt: 2 }}
            >
                Back to Orders
            </Button>
        </Paper>
    </Container>
));

ErrorView.displayName = 'ErrorView';

export default ErrorView; 