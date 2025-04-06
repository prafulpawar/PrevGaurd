import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
let response
export const registerUser = createAsyncThunk(
    '/api/auth/signup',
    async (formData, { rejectWithValue }) => {
        try {
             response = await api.post('/api/auth/signup', formData, {
               headers: {
                    'Content-Type': 'multipart/form-data',
                },
                timeout: 10000,
            });
            console.log("API Response:", response.data);
            return response.data;
        } catch (error) {
            console.log(response);
            console.error("API Error:", error);
            
            if (error.response && error.response.data && error.response.data.message) {
                return rejectWithValue(error.response.data.message);
            } else if (error.message) {
                return rejectWithValue(error.message);
            } else {
                return rejectWithValue("An unknown error occurred.");
            }
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        otpStatus: null,
        loading: false,
        error: null,
        registerFormData: {
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
            image: null,
        },
    },
    reducers: {
        updateRegisterFormData: (state, action) => {
          
            state.registerFormData[action.payload.name] = action.payload.value;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload; 
            });
    },
});

export const { updateRegisterFormData } = authSlice.actions;
export const selectRegisterFormData = (state) => state.auth.registerFormData;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;

export default authSlice.reducer;