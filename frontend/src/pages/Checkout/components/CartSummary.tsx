import { memo } from 'react';
import { Typography, Box, Paper } from '@mui/material';
import { CartItem } from '../../../types';
import CartItemComponent from './CartItemComponent';

interface CartSummaryProps {
    items: CartItem[];
    total: number;
}

const CartSummary = memo(({ items, total }: CartSummaryProps) => (
    <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
            Cart Details
        </Typography>
        <Box sx={{ mt: 2 }}>
            {items.map((item) => (
                <CartItemComponent key={item.id} item={item} />
            ))}
        </Box>
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'space-between',
                mt: 3,
                pt: 2,
                borderTop: '2px solid',
                borderColor: 'divider',
            }}
        >
            <Typography variant="h6">Total</Typography>
            <Typography variant="h6" align="right">
                ${total.toFixed(2)}
            </Typography>
        </Box>
    </Paper>
));

CartSummary.displayName = 'CartSummary';

export default CartSummary; 