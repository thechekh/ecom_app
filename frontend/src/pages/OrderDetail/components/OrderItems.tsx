import { memo } from 'react';
import { Typography, Box, Paper } from '@mui/material';
import { OrderItem } from '../../../types';
import OrderItemComponent from './OrderItemComponent';

interface OrderItemsProps {
    items: OrderItem[];
    totalAmount: number;
}

const OrderItems = memo(({ items, totalAmount }: OrderItemsProps) => (
    <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
            Order Items
        </Typography>
        <Box sx={{ mt: 2 }}>
            {items.map((item) => (
                <OrderItemComponent key={item.id} item={item} />
            ))}
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mt: 3,
                    pt: 2,
                    borderTop: '2px solid',
                    borderColor: 'divider',
                }}
            >
                <Typography variant="h6">Total</Typography>
                <Typography variant="h6">
                    ${Number(totalAmount).toFixed(2)}
                </Typography>
            </Box>
        </Box>
    </Paper>
));

OrderItems.displayName = 'OrderItems';

export default OrderItems; 