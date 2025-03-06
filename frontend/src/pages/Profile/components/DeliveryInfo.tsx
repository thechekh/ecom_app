import { memo } from 'react';
import {
    Typography,
    Grid,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';
import { FormikProps } from 'formik';

interface DeliveryInfoProps {
    formik: FormikProps<any>;
    loading: boolean;
}

const DeliveryInfo = memo(({ formik, loading }: DeliveryInfoProps) => (
    <>
        <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
            Delivery Information
        </Typography>

        <Grid container spacing={2}>
            <Grid item xs={12}>
                <TextField
                    required
                    fullWidth
                    name="delivery_address"
                    label="Delivery Address"
                    multiline
                    rows={3}
                    value={formik.values.delivery_address}
                    onChange={formik.handleChange}
                    error={formik.touched.delivery_address && Boolean(formik.errors.delivery_address)}
                    helperText={formik.touched.delivery_address && formik.errors.delivery_address}
                    disabled={loading}
                />
            </Grid>
            <Grid item xs={12}>
                <FormControl fullWidth required>
                    <InputLabel>Preferred Payment Method</InputLabel>
                    <Select
                        name="preferred_payment_method"
                        value={formik.values.preferred_payment_method}
                        label="Preferred Payment Method"
                        onChange={formik.handleChange}
                        error={formik.touched.preferred_payment_method && Boolean(formik.errors.preferred_payment_method)}
                        disabled={loading}
                    >
                        <MenuItem value="bank">To the seller's bank account</MenuItem>
                        <MenuItem value="stripe">Stripe</MenuItem>
                        <MenuItem value="google_pay">Google Pay</MenuItem>
                        <MenuItem value="apple_pay">Apple Pay</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
        </Grid>
    </>
));

DeliveryInfo.displayName = 'DeliveryInfo';

export default DeliveryInfo; 