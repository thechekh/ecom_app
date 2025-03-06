import { memo } from 'react';
import { Typography, Box, Paper } from '@mui/material';
import { Order } from '../../../types';
import { formatDate } from '../../../utils/formatters';

interface OrderInfoProps {
    order: Order;
}

const OrderInfo = memo(({ order }: OrderInfoProps) => (
    <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
            Order Information
        </Typography>
        <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
                Ordered on: {formatDate(order.created_at)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
                Payment Method: {order.payment_method.replace('_', ' ').toUpperCase()}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                Contact Information:
            </Typography>
            <Typography variant="body2">
                {order.contact_info.first_name} {order.contact_info.last_name}
            </Typography>
            <Typography variant="body2">
                {order.contact_info.email}
            </Typography>
            <Typography variant="body2">
                {order.contact_info.phone}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                Shipping Address:
            </Typography>
            <Typography variant="body2">
                {order.shipping_address}
            </Typography>
        </Box>
    </Paper>
));

OrderInfo.displayName = 'OrderInfo';

export default OrderInfo; 