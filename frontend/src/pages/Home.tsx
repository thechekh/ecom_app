import { useEffect, useState } from 'react';
import {
    Container,
    Grid,
    Typography,
    TextField,
    Box,
    Pagination,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    CircularProgress,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { fetchPosts } from '../store/slices/postsSlice';
import PostCard from '../components/PostCard';
import { debounce } from 'lodash';
import { SelectChangeEvent } from '@mui/material/Select';

const ITEMS_PER_PAGE = 10;

const Home = () => {
    const dispatch = useAppDispatch();
    const { items, totalCount, loading, error } = useAppSelector(state => state.posts);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [paginationType, setPaginationType] = useState<'page' | 'infinite'>('page');
    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

    const loadPosts = async (pageNum: number, searchQuery: string = '') => {
        await dispatch(fetchPosts({ page: pageNum, search: searchQuery }));
    };

    // Debounced search
    const debouncedSearch = debounce((value: string) => {
        setSearch(value);
        setPage(1);
        loadPosts(1, value);
    }, 500);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        debouncedSearch(event.target.value);
    };

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
        loadPosts(value, search);
        window.scrollTo(0, 0);
    };

    const handlePaginationTypeChange = (event: SelectChangeEvent<string>) => {
        setPaginationType(event.target.value as 'page' | 'infinite');
        setPage(1);
        loadPosts(1, search);
    };

    const handleScroll = () => {
        if (
            paginationType === 'infinite' &&
            !loading &&
            window.innerHeight + document.documentElement.scrollTop
            === document.documentElement.offsetHeight
        ) {
            if (page < totalPages) {
                setPage(prev => prev + 1);
                loadPosts(page + 1, search);
            }
        }
    };

    useEffect(() => {
        loadPosts(1);
    }, []);

    useEffect(() => {
        if (paginationType === 'infinite') {
            window.addEventListener('scroll', handleScroll);
            return () => window.removeEventListener('scroll', handleScroll);
        }
    }, [paginationType, loading, page, totalPages]);

    return (
        <Container maxWidth="lg">
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Posts
                </Typography>

                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Search posts"
                            variant="outlined"
                            onChange={handleSearchChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                            <InputLabel>Pagination Type</InputLabel>
                            <Select
                                value={paginationType}
                                label="Pagination Type"
                                onChange={handlePaginationTypeChange}
                            >
                                <MenuItem value="page">Page-based</MenuItem>
                                <MenuItem value="infinite">Infinite Scroll</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
            </Box>

            {error && (
                <Typography color="error" sx={{ mb: 2 }}>
                    {error}
                </Typography>
            )}

            <Grid container spacing={3}>
                {items.map(post => (
                    <Grid item xs={12} sm={6} md={4} key={post.id}>
                        <PostCard post={post} />
                    </Grid>
                ))}
            </Grid>

            {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <CircularProgress />
                </Box>
            )}

            {!loading && items.length === 0 && (
                <Typography align="center" color="textSecondary" sx={{ mt: 4 }}>
                    No posts found
                </Typography>
            )}

            {paginationType === 'page' && totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <Pagination
                        count={totalPages}
                        page={page}
                        onChange={handlePageChange}
                        color="primary"
                    />
                </Box>
            )}
        </Container>
    );
};

export default Home; 