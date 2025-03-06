import { useEffect, useState, memo, useCallback } from 'react';
import {
    Container,
    Typography,
    Box,
    Grid,
    Pagination,
    SelectChangeEvent,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { fetchPosts } from '../../store/slices/postsSlice';
import { debounce } from 'lodash';
import SearchBar from './components/SearchBar';
import SortSelector from './components/SortSelector';
import PaginationSelector from './components/PaginationSelector';
import PostGrid from './components/PostGrid';
import LoadingState from './components/LoadingState';
import EmptyState from './components/EmptyState';
import FormError from '../../components/FormError';

const ITEMS_PER_PAGE = 9;
const DEBOUNCE_DELAY = 500;
const INFINITE_SCROLL_THRESHOLD = 100;

interface HomeState {
    page: number;
    search: string;
    sort: string;
    paginationType: 'page' | 'infinite';
}

const initialState: HomeState = {
    page: 1,
    search: '',
    sort: '-created_at',
    paginationType: 'page',
};

const Home = () => {
    const dispatch = useAppDispatch();
    const { items: posts, totalCount, loading, error } = useAppSelector(state => state.posts);
    const [state, setState] = useState<HomeState>(initialState);
    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

    const loadPosts = useCallback(async (
        pageNum: number,
        searchQuery: string = '',
        sortValue: string = state.sort,
        append: boolean = false
    ) => {
        await dispatch(fetchPosts({
            page: pageNum,
            search: searchQuery,
            sort: sortValue,
            appendItems: append
        }));
    }, [dispatch, state.sort]);

    const debouncedSearch = useCallback(
        debounce((value: string) => {
            setState(prev => ({ ...prev, search: value, page: 1 }));
            loadPosts(1, value, state.sort);
        }, DEBOUNCE_DELAY),
        [loadPosts, state.sort]
    );

    const handleSearchChange = useCallback((value: string) => {
        debouncedSearch(value);
    }, [debouncedSearch]);

    const handleSortChange = useCallback((event: SelectChangeEvent<string>) => {
        const newSort = event.target.value;
        setState(prev => ({ ...prev, sort: newSort, page: 1 }));
        loadPosts(1, state.search, newSort);
    }, [loadPosts, state.search]);

    const handlePageChange = useCallback((_: React.ChangeEvent<unknown>, value: number) => {
        setState(prev => ({ ...prev, page: value }));
        loadPosts(value, state.search, state.sort);
        window.scrollTo(0, 0);
    }, [loadPosts, state.search, state.sort]);

    const handlePaginationTypeChange = useCallback((event: SelectChangeEvent<string>) => {
        const newType = event.target.value as 'page' | 'infinite';
        setState(prev => ({ ...prev, paginationType: newType, page: 1 }));
        loadPosts(1, state.search, state.sort, false);
    }, [loadPosts, state.search, state.sort]);

    useEffect(() => {
        loadPosts(1);
    }, [loadPosts]);

    useEffect(() => {
        const handleScroll = () => {
            if (
                state.paginationType === 'infinite' &&
                !loading &&
                window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - INFINITE_SCROLL_THRESHOLD
            ) {
                if (state.page < totalPages) {
                    setState(prev => ({ ...prev, page: prev.page + 1 }));
                    loadPosts(state.page + 1, state.search, state.sort, true);
                }
            }
        };

        if (state.paginationType === 'infinite') {
            window.addEventListener('scroll', handleScroll);
            return () => window.removeEventListener('scroll', handleScroll);
        }
    }, [state.paginationType, loading, state.page, totalPages, state.search, state.sort, loadPosts]);

    return (
        <Container maxWidth="lg">
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Posts
                </Typography>

                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={4}>
                        <SearchBar onSearch={handleSearchChange} />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <SortSelector value={state.sort} onChange={handleSortChange} />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <PaginationSelector
                            value={state.paginationType}
                            onChange={handlePaginationTypeChange}
                        />
                    </Grid>
                </Grid>
            </Box>

            {error && <FormError error={error} />}

            <PostGrid posts={posts} />

            {loading && state.paginationType === 'infinite' && <LoadingState />}

            {!loading && posts.length === 0 && <EmptyState />}

            {state.paginationType === 'page' && totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <Pagination
                        count={totalPages}
                        page={state.page}
                        onChange={handlePageChange}
                        color="primary"
                    />
                </Box>
            )}
        </Container>
    );
};

export default memo(Home); 