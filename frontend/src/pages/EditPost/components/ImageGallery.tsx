import { memo } from 'react';
import {
    ImageList,
    ImageListItem,
    ImageListItemBar,
    IconButton,
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { Post, PreviewImage } from '../../../types';

interface ImageGalleryProps {
    post: Post;
    newImages: PreviewImage[];
    onRemoveImage: (index: number) => void;
    disabled: boolean;
}

const ImageGallery = memo(({ post, newImages, onRemoveImage, disabled }: ImageGalleryProps) => (
    <ImageList sx={{ maxHeight: 300 }} cols={3} rowHeight={164}>
        {post.images.map((image) => (
            <ImageListItem key={image.id}>
                <img
                    src={image.image}
                    alt="Post"
                    loading="lazy"
                    style={{ height: '100%', objectFit: 'cover' }}
                />
            </ImageListItem>
        ))}
        {newImages.map((image, index) => (
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
                            onClick={() => onRemoveImage(index)}
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

ImageGallery.displayName = 'ImageGallery';

export default ImageGallery; 