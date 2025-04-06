// authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Keep registerUser as is...
export const registerUser = createAsyncThunk(
    '/api/auth/signup',
    async (formData, { rejectWithValue }) => {
        try {
            // No 'let response' needed here if only used inside try
            const response = await api.post('/api/auth/signup', formData, {
               headers: {
                    'Content-Type': 'multipart/form-data',
                },
                timeout: 10000, // Example timeout
            });
            console.log("API Response (Register):", response.data);
            // Assuming the backend returns user info including email upon successful registration initiation
            return response.data;
        } catch (error) {
            console.error("API Error (Register):", error.response || error.message || error);
            if (error.response && error.response.data && error.response.data.message) {
                return rejectWithValue(error.response.data.message);
            } else if (error.message) {
                // Handle specific errors like timeout
                if (error.code === 'ECONNABORTED') {
                    return rejectWithValue('Request timed out. Please try again.');
                }
                return rejectWithValue(error.message);
            } else {
                return rejectWithValue("An unknown registration error occurred.");
            }
        }
    }
);

// NEW: Thunk for OTP Verification
export const verifyOtp = createAsyncThunk(
    '/auth/verifyOtp', // Action type prefix
    async ({ email, otp }, { rejectWithValue }) => { // Pass email and otp
        try {
            const response = await api.post('/auth/verifyOtp', { email, otp }, {
                timeout: 10000, // Example timeout
            });
            console.log("API Response (Verify OTP):", response.data);
            // Assuming backend returns the verified user object or success status
            return response.data;
        } catch (error) {
            console.error("API Error (Verify OTP):", error.response || error.message || error);
            if (error.response && error.response.data && error.response.data.message) {
                return rejectWithValue(error.response.data.message);
            } else if (error.message) {
                 if (error.code === 'ECONNABORTED') {
                    return rejectWithValue('Request timed out. Please try again.');
                 }
                return rejectWithValue(error.message);
            } else {
                return rejectWithValue("An unknown OTP verification error occurred.");
            }
        }
    }
);


// NEW: Thunk for Resending OTP (Optional but good practice)
export const resendOtp = createAsyncThunk(
    '/auth/resendOtp', // Action type prefix
    async (email, { rejectWithValue }) => { // Pass email
        try {
            const response = await api.post('/auth/resend-otp', { email }, { // Adjust endpoint if needed
                timeout: 10000,
            });
            console.log("API Response (Resend OTP):", response.data);
            // Usually just returns a success message
            return response.data.message || 'OTP resent successfully.';
        } catch (error) {
            console.error("API Error (Resend OTP):", error.response || error.message || error);
            if (error.response && error.response.data && error.response.data.message) {
                return rejectWithValue(error.response.data.message);
            } else if (error.message) {
                 if (error.code === 'ECONNABORTED') {
                    return rejectWithValue('Request timed out. Please try again.');
                 }
                return rejectWithValue(error.message);
            } else {
                return rejectWithValue("An unknown error occurred while resending OTP.");
            }
        }
    }
);


const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null, // Will store user info after registration/login/OTP verification
        isVerified: false, // Track verification status
        loading: false,
        error: null, // For general/registration errors
        otpError: null, // Specific errors for OTP verification/resend
        otpMessage: null, // For success messages like 'OTP Resent'
        registerFormData: { // Keep this for the form inputs
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
        // Optional: Clear errors manually if needed
        clearAuthError: (state) => {
            state.error = null;
        },
        clearOtpError: (state) => {
            state.otpError = null;
            state.otpMessage = null;
        },
        // Optional: Reset state on logout or when leaving auth flow
        resetAuthState: (state) => {
            state.user = null;
            state.isVerified = false;
            state.loading = false;
            state.error = null;
            state.otpError = null;
            state.otpMessage = null;
            // Decide if you want to reset registerFormData here too
            // state.registerFormData = { ...initialState.registerFormData };
        }
    },
    extraReducers: (builder) => {
        builder
            // Register User
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.otpError = null; // Clear previous errors
                state.otpMessage = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                // IMPORTANT: Store the user details returned by the backend.
                // This user object should contain the email needed for OTP verification.
                state.user = action.payload.user || action.payload; // Adjust based on your API response structure
                state.isVerified = false; // User registered but not yet verified
                state.error = null;
                 // Optionally clear form data after successful registration submission
                 /*
                 state.registerFormData = {
                     username: '', email: '', password: '', confirmPassword: '', image: null,
                 };
                 */
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload; // Use the specific registration error
                state.user = null;
            })

            // Verify OTP
            .addCase(verifyOtp.pending, (state) => {
                state.loading = true;
                state.otpError = null; // Clear previous OTP error
                state.otpMessage = null;
            })
            .addCase(verifyOtp.fulfilled, (state, action) => {
                state.loading = false;
                state.isVerified = true; // Mark as verified
                // Optionally update user details if backend sends updated user object
                if (action.payload.user) {
                   state.user = action.payload.user;
                }
                state.otpError = null;
                // You might want to clear registerFormData here if not done earlier
            })
            .addCase(verifyOtp.rejected, (state, action) => {
                state.loading = false;
                state.otpError = action.payload; // Store OTP specific error
                state.isVerified = false;
            })

             // Resend OTP
            .addCase(resendOtp.pending, (state) => {
                state.loading = true; // Or a dedicated 'resendingOtp' state
                state.otpError = null;
                state.otpMessage = 'Resending OTP...';
            })
            .addCase(resendOtp.fulfilled, (state, action) => {
                state.loading = false;
                state.otpMessage = action.payload; // Show success message
                state.otpError = null;
            })
            .addCase(resendOtp.rejected, (state, action) => {
                state.loading = false;
                state.otpError = action.payload; // Show resend error
                state.otpMessage = null;
            });
    },
});

// Export actions and selectors
export const { updateRegisterFormData, clearAuthError, clearOtpError, resetAuthState } = authSlice.actions; // Add new actions

// Existing Selectors
export const selectRegisterFormData = (state) => state.auth.registerFormData;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;

// NEW Selectors
export const selectAuthUser = (state) => state.auth.user;
export const selectIsVerified = (state) => state.auth.isVerified;
export const selectOtpError = (state) => state.auth.otpError;
export const selectOtpMessage = (state) => state.auth.otpMessage;


export default authSlice.reducer;