import { memo } from 'react';
import { Typography, Box, Paper, Grid, Button, Divider } from '@mui/material';

interface OrderSummaryProps {
    total: number;
    onCheckout: () => void;
    disabled: boolean;
}

const OrderSummary = memo(({ total, onCheckout, disabled }: OrderSummaryProps) => (
    <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
            Order Summary
        </Typography>
        <Box sx={{ my: 2 }}>
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <Typography>Subtotal</Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography align="right">
                        ${Number(total).toFixed(2)}
                    </Typography>
                </Grid>
            </Grid>
        </Box>
        <Divider sx={{ my: 2 }} />
        <Box sx={{ my: 2 }}>
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <Typography variant="h6">Total</Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography variant="h6" align="right">
                        ${Number(total).toFixed(2)}
                    </Typography>
                </Grid>
            </Grid>
        </Box>
        <Button
            variant="contained"
            fullWidth
            size="large"
            onClick={onCheckout}
            disabled={disabled}
        >
            Proceed to Checkout
        </Button>
    </Paper>
));

export default OrderSummary; 