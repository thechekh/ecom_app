import { Alert } from '@mui/material';

interface FormErrorProps {
    error: string | null;
}

const FormError = ({ error }: FormErrorProps) => {
    if (!error) return null;

    return (
        <Alert severity="error" sx={{ mb: 2 }}>
            {error}
        </Alert>
    );
};

export default FormError; 