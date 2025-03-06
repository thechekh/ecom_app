import { memo } from 'react';
import { Typography, Box, Card, CardMedia, CardContent, IconButton } from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { CartItem } from '../../../types';
import LoadingOverlay from '../../../components/LoadingOverlay';

interface CartItemComponentProps {
    item: CartItem;
    onRemove: (id: number) => void;
    isUpdating: boolean;
}

const CartItemComponent = memo(({ item, onRemove, isUpdating }: CartItemComponentProps) => (
    <Card sx={{ mb: 2, display: 'flex', position: 'relative' }}>
        <LoadingOverlay loading={isUpdating} />
        <CardMedia
            component="img"
            sx={{ width: 150, height: 150, objectFit: 'cover' }}
            image={item.post.images[0]?.image}
            alt={item.post.caption}
        />
        <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            <CardContent sx={{ flex: '1 0 auto' }}>
                <Typography variant="h6" gutterBottom>
                    {item.post.user.username}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                    {item.post.caption}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="h6" color="primary">
                        ${Number(item.post.price).toFixed(2)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Quantity: {item.quantity}
                    </Typography>
                </Box>
            </CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', pl: 2, pb: 2 }}>
                <IconButton
                    onClick={() => onRemove(item.id)}
                    color="error"
                    disabled={isUpdating}
                >
                    <DeleteIcon />
                </IconButton>
            </Box>
        </Box>
    </Card>
));

export default CartItemComponent; 