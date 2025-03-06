import { memo } from 'react';
import { Typography, Box, Grid } from '@mui/material';
import { CartItem } from '../../../types';

interface CartItemComponentProps {
    item: CartItem;
}

const CartItemComponent = memo(({ item }: CartItemComponentProps) => (
    <Box sx={{ mb: 2 }}>
        <Grid container spacing={2} alignItems="center">
            <Grid item xs={2}>
                <Box
                    component="img"
                    src={item.post.images[0]?.image}
                    alt={item.post.caption}
                    sx={{
                        width: '100%',
                        aspectRatio: '1',
                        objectFit: 'cover',
                        borderRadius: 1,
                    }}
                />
            </Grid>
            <Grid item xs={6}>
                <Typography variant="subtitle2">
                    {item.post.caption}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Quantity: {item.quantity}
                </Typography>
            </Grid>
            <Grid item xs={4}>
                <Typography variant="subtitle2" align="right">
                    ${(item.post.price * item.quantity).toFixed(2)}
                </Typography>
            </Grid>
        </Grid>
    </Box>
));

CartItemComponent.displayName = 'CartItemComponent';

export default CartItemComponent;
