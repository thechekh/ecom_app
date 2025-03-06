import { memo, ChangeEvent } from 'react';
import { Box, Button } from '@mui/material';
import { CloudUpload as UploadIcon } from '@mui/icons-material';

interface ImageUploadProps {
    onImageChange: (event: ChangeEvent<HTMLInputElement>) => void;
    disabled: boolean;
}

const ImageUpload = memo(({ onImageChange, disabled }: ImageUploadProps) => (
    <Box
        sx={{
            border: '2px dashed',
            borderColor: 'primary.main',
            borderRadius: 1,
            p: 3,
            textAlign: 'center',
        }}
    >
        <input
            accept="image/*"
            style={{ display: 'none' }}
            id="image-upload"
            multiple
            type="file"
            onChange={onImageChange}
            disabled={disabled}
        />
        <label htmlFor="image-upload">
            <Button
                variant="outlined"
                component="span"
                startIcon={<UploadIcon />}
                disabled={disabled}
            >
                Upload Images
            </Button>
        </label>
    </Box>
));

ImageUpload.displayName = 'ImageUpload';

export default ImageUpload; 