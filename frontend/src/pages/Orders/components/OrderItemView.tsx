import { memo } from 'react';
import { Typography, Box } from '@mui/material';
import { OrderItem } from '../../../types';

interface OrderItemViewProps {
    item: OrderItem;
}

const OrderItemView = memo(({ item }: OrderItemViewProps) => {
    if (!item.post) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                    Item no longer available
                </Typography>
                <Typography variant="body2">
                    ${Number(item.price).toFixed(2)}
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {item.post.images?.[0]?.image ? (
                    <Box
                        component="img"
                        src={item.post.images[0].image}
                        alt={item.post.caption || 'Product image'}
                        sx={{
                            width: 50,
                            height: 50,
                            objectFit: 'cover',
                        }}
                    />
                ) : (
                    <Box
                        sx={{
                            width: 50,
                            height: 50,
                            bgcolor: 'grey.200',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Typography variant="caption" color="text.secondary">
                            No image
                        </Typography>
                    </Box>
                )}
                <Box>
                    <Typography variant="body2">
                        {item.post.caption || 'No caption'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Quantity: {item.quantity}
                    </Typography>
                </Box>
            </Box>
            <Typography variant="body2">
                ${Number(item.price).toFixed(2)}
            </Typography>
        </Box>
    );
});

export default OrderItemView; 