
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

const initialState = {
    user: JSON.parse(localStorage.getItem('user')) || null,
    accessToken: localStorage.getItem('accessToken') || null,
    refreshToken: localStorage.getItem('refreshToken') || null,
    isLoading: false,
    error: null,
};

const clearAuthData = (state) => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    state.isLoading = false;
    state.user = null;
    state.accessToken = null;
    state.refreshToken = null;
    state.error = null;
};



export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await api.post('/api/auth/login', credentials, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
         
            localStorage.setItem('accessToken', response.data.accessToken);
            localStorage.setItem('refreshToken', response.data.refreshToken);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            return response.data; 
        } catch (error) {
            console.error("Login API Error:", error.response?.data || error.message);
           
            return rejectWithValue(error.response?.data?.message || 'Login failed.');
        }
    }
);

export const logoutUser = createAsyncThunk(
    'auth/logoutUser',
    async (_, { getState, rejectWithValue }) => {
        const { accessToken } = getState().auth;

        
        if (!accessToken) {
            console.log("Client already logged out (no access token found).");
            
            return { message: "Already logged out locally." };
        }

        try {
         
            console.log("Attempting backend logout...");
            const response = await api.get('/api/auth/logout', {
                headers: {
                  
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            console.log("Backend logout successful:", response.data.message);
            return response.data; // Success message payload banega
        } catch (error) {
          
            console.error("Logout API call failed:", error.response?.data?.message || error.message);
          
            return { message: "Client-side logout completed after API attempt (API might have failed)." };
           
        }
       
    }
);

export const getUserInfo = createAsyncThunk(
    'auth/getUserInfo',
    async (_, { getState, rejectWithValue }) => {
        const { accessToken } = getState().auth;

        if (!accessToken) {
            return rejectWithValue('No access token found for getUserInfo.');
        }

        try {
            const response = await api.get('/api/auth/me', {
                headers: {
                    // Template literal sahi karein
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            // User info update karein local storage mein bhi
            localStorage.setItem('user', JSON.stringify(response.data.data));
            return response.data; // data payload banega
        } catch (error) {
            console.error("Get User Info API Error:", error.response?.data || error.message);
          
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
            localStorage.setItem('accessToken', action.payload.accessToken);
            localStorage.setItem('refreshToken', action.payload.refreshToken);
        },
       
        forceLogout: (state) => {
            clearAuthData(state);
        },
    },
    extraReducers: (builder) => {
        builder
          
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.user;
                state.accessToken = action.payload.accessToken;
                state.refreshToken = action.payload.refreshToken;
                state.error = null; 
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload; 
                state.user = null;
                state.accessToken = null;
                state.refreshToken = null;
            })
       
            .addCase(logoutUser.pending, (state) => {
                state.isLoading = true; 
            })
            .addCase(logoutUser.fulfilled, (state, action) => {
               
                clearAuthData(state);
                console.log("Redux state cleared on logout fulfilled. Message:", action.payload.message);
            })
            .addCase(logoutUser.rejected, (state, action) => {
              
                console.error("Logout rejected in reducer:", action.payload);
                clearAuthData(state);
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

export const { updateTokens, forceLogout } = authSlice.actions;
export default authSlice.reducer;
