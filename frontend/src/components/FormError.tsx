import { Alert, AlertProps } from '@mui/material';

interface FormErrorProps extends Omit<AlertProps, 'severity'> {
    error: string | null | undefined;
    className?: string;
}

const FormError = ({ error, sx, ...props }: FormErrorProps) => {
    if (!error) return null;

    return (
        <Alert
            severity="error"
            sx={{
                mb: 2,
                ...sx
            }}
            {...props}
        >
            {error}
        </Alert>
    );
};

export default FormError; 