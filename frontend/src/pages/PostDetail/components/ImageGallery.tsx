import { memo } from 'react';
import { Grid, Box } from '@mui/material';
import { PostImage } from '../../../types';

interface ImageGalleryProps {
    images: PostImage[];
}

const ImageGallery = memo(({ images }: ImageGalleryProps) => (
    <Grid
        container
        spacing={0.5}
        justifyContent="center"
        alignItems="center"
        sx={{
            mb: 2,
            width: '100%',
            margin: '0 auto'
        }}
    >
        {images.map((image, index) => (
            <Grid
                item
                xs={4}
                key={index}
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            >
                <Box
                    component="img"
                    src={image.image}
                    alt={`Product ${index + 1}`}
                    sx={{
                        width: '100%',
                        aspectRatio: '1',
                        objectFit: 'cover',
                    }}
                />
            </Grid>
        ))}
    </Grid>
));

ImageGallery.displayName = 'ImageGallery';

export default ImageGallery; 