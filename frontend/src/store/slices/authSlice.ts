import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authAPI } from '../../services/api';
import { User, LoginCredentials, RegisterData } from '../../types';

interface AuthState {
    user: User | null;
    loading: boolean;
    error: string | null;
}

// Get initial user from localStorage
const getInitialUser = (): User | null => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
};

const initialState: AuthState = {
    user: getInitialUser(),
    loading: false,
    error: null,
};

export const register = createAsyncThunk(
    'auth/register',
    async (data: RegisterData) => {
        const response = await authAPI.register(data);
        // Save user to localStorage
        localStorage.setItem('user', JSON.stringify(response.data));
        return response.data;
    }
);

export const login = createAsyncThunk(
    'auth/login',
    async (credentials: LoginCredentials) => {
        const response = await authAPI.login(credentials);
        // Save user to localStorage
        localStorage.setItem('user', JSON.stringify(response.data));
        return response.data;
    }
);

export const logout = createAsyncThunk(
    'auth/logout',
    async () => {
        await authAPI.logout();
        // Remove user from localStorage
        localStorage.removeItem('user');
    }
);

export const getProfile = createAsyncThunk(
    'auth/getProfile',
    async () => {
        const response = await authAPI.getProfile();
        // Update user in localStorage
        localStorage.setItem('user', JSON.stringify(response.data));
        return response.data;
    }
);

export const updateProfile = createAsyncThunk(
    'auth/updateProfile',
    async (data: FormData) => {
        const response = await authAPI.updateProfile(data);
        // Update user in localStorage
        localStorage.setItem('user', JSON.stringify(response.data));
        return response.data;
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Register
            .addCase(register.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(register.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Registration failed';
            })
            // Login
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Login failed';
            })
            // Logout
            .addCase(logout.fulfilled, (state) => {
                state.user = null;
            })
            // Get Profile
            .addCase(getProfile.fulfilled, (state, action) => {
                state.user = action.payload;
            })
            // Update Profile
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.user = action.payload;
            });
    },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer; 