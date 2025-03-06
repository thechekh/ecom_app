import { useState, useEffect, ChangeEvent, memo, useCallback } from 'react';
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
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { createPost } from '../../store/slices/postsSlice';
import FormError from '../../components/FormError';
import ImageUpload from './components/ImageUpload';
import ImagePreview from './components/ImagePreview';
import { PreviewImage } from '../../types';

interface CreatePostFormValues {
    caption: string;
    price: string;
}

const validationSchema = Yup.object({
    caption: Yup.string()
        .required('Caption is required')
        .max(1000, 'Caption must be at most 1000 characters'),
    price: Yup.number()
        .required('Price is required')
        .min(0.01, 'Price must be greater than 0')
        .max(999999.99, 'Price is too high')
        .test('is-decimal', 'Price cannot have more than 2 decimal places',
            (value) => !value || Number.isInteger(value * 100)),
});

const initialValues: CreatePostFormValues = {
    caption: '',
    price: '',
};

const CreatePost = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { loading, error } = useAppSelector(state => state.posts);
    const [images, setImages] = useState<PreviewImage[]>([]);
    const [submitError, setSubmitError] = useState<string | null>(null);

    useEffect(() => {
        // Cleanup preview URLs
        return () => {
            images.forEach(image => URL.revokeObjectURL(image.preview));
        };
    }, [images]);

    const handleImageChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const newImages = Array.from(event.target.files).map(file => ({
                file,
                preview: URL.createObjectURL(file),
            }));
            setImages(prev => [...prev, ...newImages]);
        }
    }, []);

    const handleRemoveImage = useCallback((index: number) => {
        setImages(prev => {
            URL.revokeObjectURL(prev[index].preview);
            return prev.filter((_, i) => i !== index);
        });
    }, []);

    const handleSubmit = useCallback(async (values: CreatePostFormValues) => {
        setSubmitError(null);

        if (images.length === 0) {
            setSubmitError('Please add at least one image');
            return;
        }

        const formData = new FormData();
        formData.append('caption', values.caption);
        formData.append('price', values.price);
        images.forEach(image => {
            formData.append('uploaded_images', image.file);
        });

        try {
            const result = await dispatch(createPost(formData)).unwrap();
            navigate(`/posts/${result.id}`);
        } catch (error: any) {
            setSubmitError(
                error.response?.data?.detail ||
                error.message ||
                'Failed to create post. Please try again.'
            );
        }
    }, [dispatch, navigate, images]);

    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: handleSubmit,
    });

    return (
        <Container maxWidth="md">
            <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
                <Typography component="h1" variant="h5" align="center" gutterBottom>
                    Create New Post
                </Typography>

                <FormError error={error || submitError} />

                <Box component="form" onSubmit={formik.handleSubmit} noValidate>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <ImageUpload
                                onImageChange={handleImageChange}
                                disabled={loading}
                            />
                        </Grid>

                        {images.length > 0 && (
                            <Grid item xs={12}>
                                <ImagePreview
                                    images={images}
                                    onRemove={handleRemoveImage}
                                    disabled={loading}
                                />
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
                                inputProps={{
                                    step: '0.01',
                                    min: '0.01',
                                    max: '999999.99'
                                }}
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
                                disabled={loading || !formik.isValid}
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

export default memo(CreatePost); 