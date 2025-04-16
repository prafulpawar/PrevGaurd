import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

const initialState = {
    user: JSON.parse(localStorage.getItem('user')) || null,
    accessToken: localStorage.getItem('accessToken') || null,
    refreshToken: localStorage.getItem('refreshToken') || null,
    isLoading: false,
    error: null,
};

export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await api.post('/api/auth/login', credentials,{
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            localStorage.setItem('accessToken', response.data.accessToken);
            localStorage.setItem('refreshToken', response.data.refreshToken);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            return response.data;
        } catch (error) {
            console.log(error)
            return rejectWithValue(error.response?.data?.message || 'Login failed.');
        }
    }
);

export const logoutUser = createAsyncThunk(
    'auth/logoutUser',
    async (_, { getState, dispatch, rejectWithValue }) => {
        try {
            const { accessToken, refreshToken } = getState().auth;

            const logoutAttempt = async (token) => {
                try {
                    const response = await api.get('/api/auth/logout', {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                    localStorage.removeItem('user');
                    return response.data;
                } catch (error) {
                    if (error.response?.status === 401 || error.response?.status === 403) {
                        if (refreshToken) {
                            try {
                                const refreshResponse = await api.post('/api/auth/refresh', { refreshToken });
                                const newAccessToken = refreshResponse.data.accessToken;
                                const newRefreshToken = refreshResponse.data.refreshToken;
                                localStorage.setItem('accessToken', newAccessToken);
                                localStorage.setItem('refreshToken', newRefreshToken);
                                dispatch(updateTokens({ accessToken: newAccessToken, refreshToken: newRefreshToken }));
                                // Retry logout with the new access token
                                return await logoutAttempt(newAccessToken);
                            } catch (refreshError) {
                                console.error("Refresh token failed:", refreshError);
                                localStorage.removeItem('accessToken');
                                localStorage.removeItem('refreshToken');
                                localStorage.removeItem('user');
                                throw new Error('Logout failed: Refresh token invalid.');
                            }
                        } else {
                            localStorage.removeItem('accessToken');
                            localStorage.removeItem('refreshToken');
                            localStorage.removeItem('user');
                            throw new Error('Logout failed: No refresh token available.');
                        }
                    }
                    throw error; // Re-throw other errors
                }
            };

            return await logoutAttempt(accessToken);

        } catch (error) {
            return rejectWithValue(error.message || 'Logout failed.');
        }
    }
);

export const getUserInfo = createAsyncThunk(
    'auth/getUserInfo',
    async (_, { getState, rejectWithValue }) => {
        try {
            const { accessToken } = getState().auth;
            const response = await api.get('/api/auth/me', {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            localStorage.setItem('user', JSON.stringify(response.data.data));
            return response.data;
        } catch (error) {
            console.log(error)
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch user info.');
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        updateTokens: (state, action) => {
            state.accessToken = action.payload.accessToken;
            state.refreshToken = action.payload.refreshToken;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                console.log(action.payload)
                state.isLoading = false;
                state.user = action.payload.user;
                state.accessToken = action.payload.accessToken;
                state.refreshToken = action.payload.refreshToken;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(logoutUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.isLoading = false;
                state.user = null;
                state.accessToken = null;
                state.refreshToken = null;
            })
            .addCase(logoutUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(getUserInfo.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getUserInfo.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.data;
            })
            .addCase(getUserInfo.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

export const { updateTokens } = authSlice.actions;
export default authSlice.reducer;