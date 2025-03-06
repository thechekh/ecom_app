import { useState, useEffect, ChangeEvent, memo, useCallback } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
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
    CircularProgress,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { fetchPost, updatePost, clearSelectedPost } from '../../store/slices/postsSlice';
import FormError from '../../components/FormError';
import ImageUpload from './components/ImageUpload';
import ImageGallery from './components/ImageGallery';
import UnsavedChangesDialog from './components/UnsavedChangesDialog';
import { PreviewImage } from '../../types';

interface EditPostFormValues {
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

const LoadingState = memo(() => (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
    </Box>
));

const NotFoundState = memo(() => (
    <Typography align="center" sx={{ mt: 4 }}>
        Post not found
    </Typography>
));

const EditPost = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useAppDispatch();
    const { selectedPost: post, loading, error } = useAppSelector(state => state.posts);
    const { user } = useAppSelector(state => state.auth);
    const [images, setImages] = useState<PreviewImage[]>([]);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);
    const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            dispatch(fetchPost(parseInt(id)));
        }
        return () => {
            dispatch(clearSelectedPost());
            images.forEach(image => URL.revokeObjectURL(image.preview));
        };
    }, [id, dispatch, images]);

    useEffect(() => {
        if (post && user && post.user.id !== user.id) {
            navigate('/', { replace: true });
        }
    }, [post, user, navigate]);

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

    const handleSubmit = useCallback(async (values: EditPostFormValues) => {
        if (!post) return;

        setSubmitError(null);
        const formData = new FormData();
        formData.append('caption', values.caption);
        formData.append('price', values.price);
        images.forEach(image => {
            formData.append('uploaded_images', image.file);
        });

        try {
            const result = await dispatch(updatePost({ id: post.id, data: formData })).unwrap();
            if (result) {
                navigate(`/posts/${post.id}`);
            }
        } catch (error: any) {
            setSubmitError(
                error.response?.data?.detail ||
                error.message ||
                'Failed to update post. Please try again.'
            );
        }
    }, [dispatch, images, navigate, post]);

    const handleNavigate = useCallback((path: string) => {
        if (formik.dirty || images.length > 0) {
            setPendingNavigation(path);
            setShowUnsavedDialog(true);
        } else {
            navigate(path);
        }
    }, [navigate, images.length]);

    const handleConfirmNavigation = useCallback(() => {
        setShowUnsavedDialog(false);
        if (pendingNavigation) {
            navigate(pendingNavigation);
        }
    }, [navigate, pendingNavigation]);

    const handleCancelNavigation = useCallback(() => {
        setShowUnsavedDialog(false);
        setPendingNavigation(null);
    }, []);

    const formik = useFormik({
        initialValues: {
            caption: post?.caption || '',
            price: post?.price?.toString() || '',
        },
        validationSchema,
        enableReinitialize: true,
        onSubmit: handleSubmit,
    });

    if (loading && !post) {
        return <LoadingState />;
    }

    if (!post) {
        return <NotFoundState />;
    }

    return (
        <Container maxWidth="md">
            <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Button
                        variant="outlined"
                        onClick={() => handleNavigate(`/posts/${post.id}`)}
                        sx={{ mr: 2 }}
                    >
                        Back to Post
                    </Button>
                    <Typography component="h1" variant="h5">
                        Edit Post
                    </Typography>
                </Box>

                <FormError error={error || submitError} />

                <Box component="form" onSubmit={formik.handleSubmit} noValidate>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <ImageUpload
                                onImageChange={handleImageChange}
                                disabled={loading}
                            />
                        </Grid>

                        {(post.images.length > 0 || images.length > 0) && (
                            <Grid item xs={12}>
                                <ImageGallery
                                    post={post}
                                    newImages={images}
                                    onRemoveImage={handleRemoveImage}
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
                                {loading ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>

            <UnsavedChangesDialog
                open={showUnsavedDialog}
                onConfirm={handleConfirmNavigation}
                onCancel={handleCancelNavigation}
            />
        </Container>
    );
};

export default memo(EditPost); 