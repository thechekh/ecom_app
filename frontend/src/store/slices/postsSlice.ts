import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { postsAPI } from '../../services/api';
import { Post } from '../../types';

interface PostsState {
    items: Post[];
    totalCount: number;
    currentPage: number;
    loading: boolean;
    error: string | null;
    selectedPost: Post | null;
}

const initialState: PostsState = {
    items: [],
    totalCount: 0,
    currentPage: 1,
    loading: false,
    error: null,
    selectedPost: null,
};

export const fetchPosts = createAsyncThunk(
    'posts/fetchPosts',
    async ({ page, search }: { page: number; search?: string }) => {
        const response = await postsAPI.getPosts(page, search);
        return response.data;
    }
);

export const fetchPost = createAsyncThunk(
    'posts/fetchPost',
    async (id: number) => {
        const response = await postsAPI.getPost(id);
        return response.data;
    }
);

export const createPost = createAsyncThunk(
    'posts/createPost',
    async (data: FormData) => {
        const response = await postsAPI.createPost(data);
        return response.data;
    }
);

export const updatePost = createAsyncThunk(
    'posts/updatePost',
    async ({ id, data }: { id: number; data: FormData }) => {
        const response = await postsAPI.updatePost(id, data);
        return response.data;
    }
);

export const deletePost = createAsyncThunk(
    'posts/deletePost',
    async (id: number) => {
        await postsAPI.deletePost(id);
        return id;
    }
);

const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearSelectedPost: (state) => {
            state.selectedPost = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch Posts
            .addCase(fetchPosts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPosts.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload.results;
                state.totalCount = action.payload.count;
            })
            .addCase(fetchPosts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch posts';
            })
            // Fetch Single Post
            .addCase(fetchPost.fulfilled, (state, action) => {
                state.selectedPost = action.payload;
            })
            // Create Post
            .addCase(createPost.fulfilled, (state, action) => {
                state.items.unshift(action.payload);
                state.totalCount += 1;
            })
            // Update Post
            .addCase(updatePost.fulfilled, (state, action) => {
                const index = state.items.findIndex(post => post.id === action.payload.id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
                if (state.selectedPost?.id === action.payload.id) {
                    state.selectedPost = action.payload;
                }
            })
            // Delete Post
            .addCase(deletePost.fulfilled, (state, action) => {
                state.items = state.items.filter(post => post.id !== action.payload);
                state.totalCount -= 1;
                if (state.selectedPost?.id === action.payload) {
                    state.selectedPost = null;
                }
            });
    },
});

export const { clearError, clearSelectedPost } = postsSlice.actions;
export default postsSlice.reducer; 