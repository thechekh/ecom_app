import { useState, useEffect, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
    Container,
    Box,
    Typography,
    TextField,
    Button,
    Paper,
    Grid,
    IconButton,
    ImageList,
    ImageListItem,
    ImageListItemBar,
} from '@mui/material';
import {
    CloudUpload as UploadIcon,
    Delete as DeleteIcon,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { createPost } from '../store/slices/postsSlice';
import FormError from '../components/FormError';

const validationSchema = Yup.object({
    caption: Yup.string().required('Caption is required'),
    price: Yup.number()
        .required('Price is required')
        .min(0.01, 'Price must be greater than 0')
        .max(999999.99, 'Price is too high'),
});

interface PreviewImage {
    file: File;
    preview: string;
}

const CreatePost = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { loading, error } = useAppSelector(state => state.posts);
    const [images, setImages] = useState<PreviewImage[]>([]);

    useEffect(() => {
        // Cleanup preview URLs
        return () => {
            images.forEach(image => URL.revokeObjectURL(image.preview));
        };
    }, [images]);

    const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const newImages = Array.from(event.target.files).map(file => ({
                file,
                preview: URL.createObjectURL(file),
            }));
            setImages(prev => [...prev, ...newImages]);
        }
    };

    const handleRemoveImage = (index: number) => {
        setImages(prev => {
            URL.revokeObjectURL(prev[index].preview);
            return prev.filter((_, i) => i !== index);
        });
    };

    const formik = useFormik({
        initialValues: {
            caption: '',
            price: '',
        },
        validationSchema,
        onSubmit: async (values) => {
            if (images.length === 0) {
                alert('Please add at least one image');
                return;
            }

            const formData = new FormData();
            formData.append('caption', values.caption);
            formData.append('price', values.price);
            images.forEach((image, index) => {
                formData.append('uploaded_images', image.file);
            });

            const result = await dispatch(createPost(formData));
            if (createPost.fulfilled.match(result)) {
                navigate(`/posts/${result.payload.id}`);
            } else if (createPost.rejected.match(result)) {
                console.error(result.error);
            }
        },
    });

    return (
        <Container maxWidth="md">
            <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
                <Typography component="h1" variant="h5" align="center" gutterBottom>
                    Create New Post
                </Typography>

                <FormError error={error} />

                <Box component="form" onSubmit={formik.handleSubmit} noValidate>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
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
                                    onChange={handleImageChange}
                                    disabled={loading}
                                />
                                <label htmlFor="image-upload">
                                    <Button
                                        variant="outlined"
                                        component="span"
                                        startIcon={<UploadIcon />}
                                        disabled={loading}
                                    >
                                        Upload Images
                                    </Button>
                                </label>
                            </Box>
                        </Grid>

                        {images.length > 0 && (
                            <Grid item xs={12}>
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
                                                        onClick={() => handleRemoveImage(index)}
                                                        disabled={loading}
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                }
                                            />
                                        </ImageListItem>
                                    ))}
                                </ImageList>
                            </Grid>
                        )}

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                id="caption"
                                name="caption"
                                label="Caption"
                                multiline
                                rows={4}
                                value={formik.values.caption}
                                onChange={formik.handleChange}
                                error={formik.touched.caption && Boolean(formik.errors.caption)}
                                helperText={formik.touched.caption && formik.errors.caption}
                                disabled={loading}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                id="price"
                                name="price"
                                label="Price"
                                type="number"
                                inputProps={{ step: '0.01' }}
                                value={formik.values.price}
                                onChange={formik.handleChange}
                                error={formik.touched.price && Boolean(formik.errors.price)}
                                helperText={formik.touched.price && formik.errors.price}
                                disabled={loading}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                disabled={loading}
                            >
                                {loading ? 'Creating...' : 'Create Post'}
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
        </Container>
    );
};

export default CreatePost; 