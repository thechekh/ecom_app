import { memo } from 'react';
import { Typography, Box } from '@mui/material';
import { OrderItem } from '../../../types';

interface OrderItemProps {
    item: OrderItem;
}

const OrderItemComponent = memo(({ item }: OrderItemProps) => (
    <Box
        sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
            pb: 2,
            borderBottom: '1px solid',
            borderColor: 'divider',
            '&:last-child': {
                mb: 0,
                pb: 0,
                borderBottom: 'none',
            },
        }}
    >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
                component="img"
                src={item.post.images[0]?.image}
                alt={item.post.caption}
                sx={{
                    width: 80,
                    height: 80,
                    objectFit: 'cover',
                    borderRadius: 1,
                }}
            />
            <Box>
                <Typography variant="body1">
                    {item.post.caption}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Quantity: {item.quantity}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Price: ${Number(item.price).toFixed(2)}
                </Typography>
            </Box>
        </Box>
        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
            ${Number(item.price * item.quantity).toFixed(2)}
        </Typography>
    </Box>
));

OrderItemComponent.displayName = 'OrderItemComponent';

export default OrderItemComponent; 