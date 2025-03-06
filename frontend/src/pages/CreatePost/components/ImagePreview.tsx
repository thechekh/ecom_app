import { memo } from 'react';
import {
    ImageList,
    ImageListItem,
    ImageListItemBar,
    IconButton,
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { PreviewImage } from '../../../types';

interface ImagePreviewProps {
    images: PreviewImage[];
    onRemove: (index: number) => void;
    disabled: boolean;
}

const ImagePreview = memo(({ images, onRemove, disabled }: ImagePreviewProps) => (
    <ImageList sx={{ maxHeight: 300 }} cols={3} rowHeight={164}>
        {images.map((image, index) => (
            <ImageListItem key={image.preview}>
                <img
                    src={image.preview}
                    alt={`Preview ${index + 1}`}
                    loading="lazy"
                    style={{ height: '100%', objectFit: 'cover' }}
                />
                <ImageListItemBar
                    actionIcon={
                        <IconButton
                            sx={{ color: 'white' }}
                            onClick={() => onRemove(index)}
                            disabled={disabled}
                        >
                            <DeleteIcon />
                        </IconButton>
                    }
                />
            </ImageListItem>
        ))}
    </ImageList>
));

ImagePreview.displayName = 'ImagePreview';

export default ImagePreview; 