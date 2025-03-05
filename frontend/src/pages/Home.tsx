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

const ITEMS_PER_PAGE = 9;

const Home = () => {
    const dispatch = useAppDispatch();
    const { items, totalCount, loading, error } = useAppSelector(state => state.posts);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [sort, setSort] = useState('-created_at');
    const [paginationType, setPaginationType] = useState<'page' | 'infinite'>('page');
    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

    const loadPosts = async (pageNum: number, searchQuery: string = '', sortValue: string = sort, append: boolean = false) => {
        await dispatch(fetchPosts({ page: pageNum, search: searchQuery, sort: sortValue, appendItems: append }));
    };

    // Debounced search
    const debouncedSearch = debounce((value: string) => {
        setSearch(value);
        setPage(1);
        loadPosts(1, value, sort);
    }, 500);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        debouncedSearch(event.target.value);
    };

    const handleSortChange = (event: SelectChangeEvent<string>) => {
        const newSort = event.target.value;
        setSort(newSort);
        setPage(1);
        loadPosts(1, search, newSort);
    };

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
        loadPosts(value, search, sort);
        window.scrollTo(0, 0);
    };

    const handlePaginationTypeChange = (event: SelectChangeEvent<string>) => {
        const newType = event.target.value as 'page' | 'infinite';
        setPaginationType(newType);
        if (newType === 'page') {
            loadPosts(page, search, sort, false);
        } else {
            setPage(1);
            loadPosts(1, search, sort, false);
        }
    };

    useEffect(() => {
        loadPosts(1);
    }, []);

    useEffect(() => {
        const scrollHandler = () => {
            if (
                paginationType === 'infinite' &&
                !loading &&
                window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100
            ) {
                if (page < totalPages) {
                    setPage(prev => prev + 1);
                    loadPosts(page + 1, search, sort, true);
                }
            }
        };

        if (paginationType === 'infinite') {
            window.addEventListener('scroll', scrollHandler);
            return () => window.removeEventListener('scroll', scrollHandler);
        }
    }, [paginationType, loading, page, totalPages, search, sort]);

    return (
        <Container maxWidth="lg">
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Posts
                </Typography>

                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={4}>
                        <TextField
                            fullWidth
                            label="Search posts"
                            variant="outlined"
                            onChange={handleSearchChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <FormControl fullWidth>
                            <InputLabel>Sort By</InputLabel>
                            <Select
                                value={sort}
                                label="Sort By"
                                onChange={handleSortChange}
                            >
                                <MenuItem value="-created_at">Date (Newest First)</MenuItem>
                                <MenuItem value="created_at">Date (Oldest First)</MenuItem>
                                <MenuItem value="price">Price (Low to High)</MenuItem>
                                <MenuItem value="-price">Price (High to Low)</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={4}>
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

            {loading && paginationType === 'infinite' && (
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