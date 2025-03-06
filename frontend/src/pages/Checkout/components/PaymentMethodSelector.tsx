import { memo } from 'react';
import {
    FormControl,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio,
} from '@mui/material';

interface PaymentMethodSelectorProps {
    formik: any; // TODO: Add proper type for formik
}

const PaymentMethodSelector = memo(({ formik }: PaymentMethodSelectorProps) => (
    <FormControl component="fieldset" fullWidth>
        <FormLabel component="legend">Payment Method</FormLabel>
        <RadioGroup
            name="paymentMethod"
            value={formik.values.paymentMethod}
            onChange={formik.handleChange}
        >
            <FormControlLabel value="bank" control={<Radio />} label="To the seller's bank account" />
            <FormControlLabel value="stripe" control={<Radio />} label="Stripe" />
            <FormControlLabel value="google_pay" control={<Radio />} label="Google Pay" />
            <FormControlLabel value="apple_pay" control={<Radio />} label="Apple Pay" />
        </RadioGroup>
    </FormControl>
));

PaymentMethodSelector.displayName = 'PaymentMethodSelector';

export default PaymentMethodSelector; 