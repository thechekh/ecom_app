import { memo } from 'react';
import { Grid, TextField } from '@mui/material';

interface ContactFormProps {
    formik: any; // TODO: Add proper type for formik
}

const ContactForm = memo(({ formik }: ContactFormProps) => (
    <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
            <TextField
                fullWidth
                name="firstName"
                label="First Name"
                value={formik.values.firstName}
                onChange={formik.handleChange}
                error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                helperText={formik.touched.firstName && formik.errors.firstName}
            />
        </Grid>
        <Grid item xs={12} sm={6}>
            <TextField
                fullWidth
                name="lastName"
                label="Last Name"
                value={formik.values.lastName}
                onChange={formik.handleChange}
                error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                helperText={formik.touched.lastName && formik.errors.lastName}
            />
        </Grid>
        <Grid item xs={12}>
            <TextField
                fullWidth
                name="phone"
                label="Phone Number"
                value={formik.values.phone}
                onChange={formik.handleChange}
                error={formik.touched.phone && Boolean(formik.errors.phone)}
                helperText={formik.touched.phone && formik.errors.phone}
            />
        </Grid>
        <Grid item xs={12}>
            <TextField
                fullWidth
                name="email"
                label="Email"
                type="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
            />
        </Grid>
    </Grid>
));

ContactForm.displayName = 'ContactForm';

export default ContactForm; 