import { memo } from 'react';
import { Container, Typography, Paper, Button } from '@mui/material';

interface EmptyStateProps {
    onContinueShopping: () => void;
}

const EmptyState = memo(({ onContinueShopping }: EmptyStateProps) => (
    <Container maxWidth="md">
        <Paper elevation={3} sx={{ p: 3, mt: 4, textAlign: 'center' }}>
            <Typography variant="h5" gutterBottom>
                Your cart is empty
            </Typography>
            <Button
                variant="contained"
                onClick={onContinueShopping}
                sx={{ mt: 2 }}
            >
                Continue Shopping
            </Button>
        </Paper>
    </Container>
));

EmptyState.displayName = 'EmptyState';

export default EmptyState; 