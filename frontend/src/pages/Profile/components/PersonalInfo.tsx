import { memo } from 'react';
import { Typography, Grid, TextField } from '@mui/material';
import { FormikProps } from 'formik';

interface PersonalInfoProps {
    formik: FormikProps<any>;
    loading: boolean;
}

const PersonalInfo = memo(({ formik, loading }: PersonalInfoProps) => (
    <>
        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            Personal Information
        </Typography>

        <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
                <TextField
                    required
                    fullWidth
                    name="first_name"
                    label="First Name"
                    value={formik.values.first_name}
                    onChange={formik.handleChange}
                    error={formik.touched.first_name && Boolean(formik.errors.first_name)}
                    helperText={formik.touched.first_name && formik.errors.first_name}
                    disabled={loading}
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    required
                    fullWidth
                    name="last_name"
                    label="Last Name"
                    value={formik.values.last_name}
                    onChange={formik.handleChange}
                    error={formik.touched.last_name && Boolean(formik.errors.last_name)}
                    helperText={formik.touched.last_name && formik.errors.last_name}
                    disabled={loading}
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    required
                    fullWidth
                    name="email"
                    label="Email"
                    type="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                    disabled={loading}
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    required
                    fullWidth
                    name="phone"
                    label="Phone Number"
                    value={formik.values.phone}
                    onChange={formik.handleChange}
                    error={formik.touched.phone && Boolean(formik.errors.phone)}
                    helperText={formik.touched.phone && formik.errors.phone}
                    disabled={loading}
                />
            </Grid>
        </Grid>
    </>
));

PersonalInfo.displayName = 'PersonalInfo';

export default PersonalInfo; 