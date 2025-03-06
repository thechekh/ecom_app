import { memo } from 'react';
import { Typography, Box, Paper, Grid } from '@mui/material';
import { Order } from '../../../types';
import { formatDate } from '../../../utils/formatters';
import OrderItemView from './OrderItemView';

interface OrderCardProps {
    order: Order;
}

const OrderCard = memo(({ order }: OrderCardProps) => (
    <Paper elevation={3} sx={{ p: 3 }}>
        <Box sx={{ mb: 2 }}>
            <Typography variant="h6">
                Order #{order.id}
            </Typography>
        </Box>

        <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                    Ordered on: {formatDate(order.created_at)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Payment Method: {(order.payment_method || '').replace('_', ' ').toUpperCase()}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Shipping Address:
                </Typography>
                <Typography variant="body2">
                    {order.shipping_address}
                </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" gutterBottom>
                    Order Items:
                </Typography>
                {order.items?.map((item) => (
                    <OrderItemView key={item.id} item={item} />
                ))}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Typography variant="h6">
                        Total: ${Number(order.total_amount || 0).toFixed(2)}
                    </Typography>
                </Box>
            </Grid>
        </Grid>
    </Paper>
));

export default OrderCard; 