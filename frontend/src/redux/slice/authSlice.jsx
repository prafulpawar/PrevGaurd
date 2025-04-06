// authSlice.jsx (or authSlice.js)
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api'; // Adjust path if needed

// --- Async Thunks ---

// 1. Register User Thunk
export const registerUser = createAsyncThunk(
    'auth/registerUser', // Use 'sliceName/actionName' convention for typePrefix
    async (formData, { rejectWithValue }) => {
        try {
            const response = await api.post('/api/auth/signup', formData, {
               headers: { 'Content-Type': 'multipart/form-data' },
               timeout: 15000, // Example timeout
            });
            console.log("API Response (Register):", response.data);
            // Expecting response.data like { user: {...}, requestId: '...' }
            if (!response.data.requestId) {
                 console.warn("requestId missing from registration response. OTP status polling might not work.");
            }
            return response.data;
        } catch (error) {
            console.error("API Error (Register):", error.response?.data || error.message || error);
            if (error.response && error.response.data && error.response.data.message) {
                return rejectWithValue(error.response.data.message);
            } else if (error.code === 'ECONNABORTED') {
                 return rejectWithValue('Registration request timed out. Please try again.');
            } else if (error.message) {
                return rejectWithValue(error.message);
            } else {
                return rejectWithValue("An unknown registration error occurred.");
            }
        }
    }
);

// 2. Verify OTP Thunk
export const verifyOtp = createAsyncThunk(
    'auth/verifyOtp', // Action type prefix
    async ({ email, otp }, { rejectWithValue }) => { // Pass email and otp
        if (!email || !otp) {
            return rejectWithValue("Email and OTP are required for verification.");
        }
        try {
            const response = await api.post('/auth/verifyOtp', { email, otp }, {
                timeout: 10000, // Example timeout
            });
            console.log("API Response (Verify OTP):", response.data);
            // Expecting backend to return verified user object or success status
            // e.g., { success: true, user: {...} } or just { user: {...} }
            return response.data;
        } catch (error) {
            console.error("API Error (Verify OTP):", error.response?.data || error.message || error);
            if (error.response && error.response.data && error.response.data.message) {
                return rejectWithValue(error.response.data.message);
            } else if (error.code === 'ECONNABORTED') {
                return rejectWithValue('OTP verification request timed out.');
            } else if (error.message) {
                return rejectWithValue(error.message);
            } else {
                return rejectWithValue("An unknown OTP verification error occurred.");
            }
        }
    }
);

// 3. Resend OTP Thunk
export const resendOtp = createAsyncThunk(
    'auth/resendOtp', // Action type prefix
    async (email, { rejectWithValue }) => { // Pass email
        if (!email) {
            return rejectWithValue("Email is required to resend OTP.");
        }
        try {
            // Adjust endpoint '/auth/resend-otp' if needed by your backend API
            const response = await api.post('/auth/resend-otp', { email }, {
                timeout: 10000, // Example timeout
            });
            console.log("API Response (Resend OTP):", response.data);
            // Backend might return { message: '...', requestId: '...' } or just { message: '...' }
            return response.data;
        } catch (error) {
            console.error("API Error (Resend OTP):", error.response?.data || error.message || error);
            if (error.response && error.response.data && error.response.data.message) {
                return rejectWithValue(error.response.data.message);
            } else if (error.code === 'ECONNABORTED') {
                 return rejectWithValue('Resend OTP request timed out.');
            } else if (error.message) {
                return rejectWithValue(error.message);
            } else {
                return rejectWithValue("An unknown error occurred while resending OTP.");
            }
        }
    }
);

// 4. Check OTP Status Thunk
export const checkOtpStatus = createAsyncThunk(
    'auth/checkOtpStatus', // Action type prefix
    async (requestId, { rejectWithValue }) => {
        if (!requestId) {
            return rejectWithValue("No request ID available to check status.");
        }
        try {
            console.log(`Checking OTP status for requestId: ${requestId}`);
            // Ensure the endpoint matches your backend API
            const response = await api.get(`/api/otp-status?requestId=${requestId}`, {
                timeout: 5000, // Short timeout for status check
            });
            console.log("API Response (OTP Status):", response.data);
            // Expecting response.data like { status: 'PENDING' | 'SENT' | 'FAILED' | 'EXPIRED' }
            if (!response.data || typeof response.data.status === 'undefined') {
                 console.warn("Invalid OTP status response structure:", response.data);
                 return rejectWithValue("Received invalid status response from server.");
            }
            return response.data; // Contains { status: '...' }
        } catch (error) {
            console.error("API Error (OTP Status Check):", error.response?.data || error.message || error);
             if (error.code === 'ECONNABORTED') {
                 // Indicate timeout, maybe polling component can handle this silently
                 return rejectWithValue('TIMEOUT');
             }
             if (error.response && error.response.status === 404) {
                 // Request ID not found or expired on the backend
                 return rejectWithValue('NOT_FOUND');
             }
             // Generic error for other connection issues etc.
            return rejectWithValue("Failed to check OTP status.");
        }
    }
);

// --- Initial State ---

const initialState = {
    user: null, // Stores user info after successful login/verification
    isVerified: false, // Tracks if the current user's email is verified
    loading: false, // General loading state (Register, Verify, Resend)
    error: null, // General authentication errors (e.g., Registration failure)
    otpError: null, // Specific errors for OTP steps (Verify, Resend, Status Check)
    otpMessage: null, // Success messages (e.g., 'OTP Resent')

    // OTP Status Polling State
    otpRequestId: null, // ID received from registration to track OTP sending
    otpDeliveryStatus: 'idle', // 'idle', 'pending_send', 'checking', 'sent', 'failed', 'expired', 'not_found', 'verified', 'timeout'
    isCheckingOtpStatus: false, // Loading indicator specific to the status check API call

    // Registration Form Data (Consider if this should be local component state instead)
    registerFormData: {
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        image: null,
    },
};


// --- Slice Definition ---

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        // Reducer to update parts of the registration form data in state
        updateRegisterFormData: (state, action) => {
            // Ensure payload has name and value
            if (action.payload && typeof action.payload.name !== 'undefined') {
              state.registerFormData[action.payload.name] = action.payload.value;
            }
        },
        // Action to manually clear the main authentication error
        clearAuthError: (state) => {
            state.error = null;
        },
        // Action to manually clear OTP-related errors and messages
        clearOtpError: (state) => {
            state.otpError = null;
            state.otpMessage = null;
        },
        // Action to manually set the OTP delivery status (e.g., for timeouts handled in component)
        setOtpDeliveryStatus: (state, action) => {
            state.otpDeliveryStatus = action.payload;
        },
        // Action to reset the entire auth state (e.g., on logout)
        resetAuthState: (state) => {
            // Reset to initial state values
            Object.assign(state, initialState);
             // Keep registerFormData or reset it too? Depends on desired UX.
             // Example: Resetting form data as well
             state.registerFormData = { ...initialState.registerFormData };
        }
    },
    extraReducers: (builder) => {
        builder
            // --- Register User ---
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.otpError = null;
                state.otpMessage = null;
                state.otpRequestId = null;
                state.otpDeliveryStatus = 'idle';
                state.isCheckingOtpStatus = false;
                state.isVerified = false; // Reset verification status
                state.user = null; // Clear previous user data
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                // Assuming payload is { user: {...}, requestId: '...' }
                state.user = action.payload?.user || null;
                state.isVerified = false; // Registered but not verified yet
                state.otpRequestId = action.payload?.requestId || null;
                // Set status based on whether we got a request ID
                state.otpDeliveryStatus = state.otpRequestId ? 'pending_send' : 'idle';
                state.error = null; // Clear previous registration errors
                // Optionally clear form data on successful registration submission:
                // state.registerFormData = { ...initialState.registerFormData };
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload; // Store registration-specific error
                state.user = null;
                state.otpRequestId = null;
                state.otpDeliveryStatus = 'idle';
                state.isVerified = false;
            })

            // --- Verify OTP ---
            .addCase(verifyOtp.pending, (state) => {
                state.loading = true; // Use general loading state
                state.otpError = null; // Clear previous OTP errors
                state.otpMessage = null;
            })
            .addCase(verifyOtp.fulfilled, (state, action) => {
                state.loading = false;
                state.isVerified = true;
                // Update user data if backend returns updated user object
                if (action.payload?.user) {
                   state.user = action.payload.user;
                }
                state.otpError = null;
                // Mark OTP process as complete/verified
                state.otpDeliveryStatus = 'verified';
                state.isCheckingOtpStatus = false; // Stop any polling spinner
                state.otpRequestId = null; // Clear the ID, no longer needed for polling
            })
            .addCase(verifyOtp.rejected, (state, action) => {
                state.loading = false;
                state.otpError = action.payload; // Store verification-specific error
                state.isVerified = false; // Verification failed
                // Keep otpDeliveryStatus as 'sent' or previous state, don't reset polling state here usually
            })

            // --- Resend OTP ---
            .addCase(resendOtp.pending, (state) => {
                 state.loading = true; // Use general loading state
                 state.otpError = null;
                 state.otpMessage = 'Resending OTP...';
                 // Reset status to indicate a new OTP send attempt is starting
                 state.otpDeliveryStatus = 'pending_send';
                 state.isCheckingOtpStatus = false; // Ensure polling spinner is off initially
                 // Decide if resend gives a *new* ID. If yes, clear old one.
                 // state.otpRequestId = null; // Uncomment if backend issues new ID on resend
            })
             .addCase(resendOtp.fulfilled, (state, action) => {
                 state.loading = false;
                 state.otpMessage = action.payload?.message || 'OTP resent successfully.';
                 state.otpError = null;
                 // If resend provides a new requestId, update it here:
                 if (action.payload?.requestId) {
                    state.otpRequestId = action.payload.requestId;
                 }
                 // Ensure status reflects the new attempt (polling should restart in component)
                 state.otpDeliveryStatus = state.otpRequestId ? 'pending_send' : 'idle';
                 state.isCheckingOtpStatus = false;
            })
            .addCase(resendOtp.rejected, (state, action) => {
                 state.loading = false;
                 state.otpError = action.payload; // Store resend-specific error
                 state.otpMessage = null;
                 // Optional: Set status to failed if resend fails critically
                 // state.otpDeliveryStatus = 'failed';
                 // Keep otpRequestId as is, component might retry polling or resend
            })

            // --- Check OTP Status ---
            .addCase(checkOtpStatus.pending, (state) => {
                state.isCheckingOtpStatus = true;
                // Don't modify otpError/otpMessage here usually, let verify/resend errors persist until resolved
            })
            .addCase(checkOtpStatus.fulfilled, (state, action) => {
                state.isCheckingOtpStatus = false;
                // Update otpDeliveryStatus based on backend response action.payload = { status: '...' }
                const status = action.payload?.status?.toLowerCase();
                switch (status) {
                    case 'sent':
                        if (state.otpDeliveryStatus !== 'verified') { // Avoid overwriting if already verified
                             state.otpDeliveryStatus = 'sent';
                             state.otpError = null; // Clear previous errors now that it's sent
                             state.otpMessage = 'OTP has been sent.';
                        }
                        break;
                    case 'pending':
                        // Stay in pending_send if backend confirms still pending
                        if (state.otpDeliveryStatus !== 'verified') {
                             state.otpDeliveryStatus = 'pending_send';
                        }
                        break;
                    case 'failed':
                         state.otpDeliveryStatus = 'failed';
                         state.otpError = 'Failed to send OTP. Please try resending.';
                         state.otpMessage = null;
                         break;
                    case 'expired':
                         state.otpDeliveryStatus = 'expired';
                         state.otpError = 'OTP request expired. Please try resending.';
                         state.otpMessage = null;
                         break;
                    // Add any other statuses your backend might return
                    default:
                        console.warn("Unhandled OTP status received:", status);
                        // Optionally keep existing status or set to 'unknown'
                        break;
                }
            })
            .addCase(checkOtpStatus.rejected, (state, action) => {
                state.isCheckingOtpStatus = false;
                // Handle specific rejection values from the thunk payload creator
                switch(action.payload) {
                    case 'TIMEOUT':
                         // Polling timed out, could show a subtle indicator or just log
                         console.warn("OTP Status check timed out.");
                         // Optionally set a specific status or error
                         // state.otpDeliveryStatus = 'timeout';
                         // state.otpError = 'Could not confirm OTP status in time.';
                         break;
                    case 'NOT_FOUND':
                         // Request ID invalid or expired on backend
                         state.otpDeliveryStatus = 'not_found';
                         state.otpError = 'OTP request not found or expired. Please resend.';
                         state.otpMessage = null;
                         break;
                    default:
                        // Generic failure to check status (network error etc.)
                         console.warn("OTP Status check failed:", action.payload);
                         // Decide if you want to show a generic error
                         // state.otpError = 'Failed to check OTP status. Check connection.';
                         break;
                 }
            });
    },
});

// --- Actions ---
export const {
    updateRegisterFormData,
    clearAuthError,
    clearOtpError,
    resetAuthState,
    setOtpDeliveryStatus // Export if needed for manual status updates
} = authSlice.actions;

// --- Selectors ---
export const selectRegisterFormData = (state) => state.auth.registerFormData;
export const selectAuthLoading = (state) => state.auth.loading; // General loading
export const selectAuthError = (state) => state.auth.error; // Registration/general error
export const selectAuthUser = (state) => state.auth.user;
export const selectIsVerified = (state) => state.auth.isVerified;
export const selectOtpError = (state) => state.auth.otpError; // Verify/Resend/Status errors
export const selectOtpMessage = (state) => state.auth.otpMessage; // Resend/Status messages
export const selectOtpRequestId = (state) => state.auth.otpRequestId;
export const selectOtpDeliveryStatus = (state) => state.auth.otpDeliveryStatus;
export const selectIsCheckingOtpStatus = (state) => state.auth.isCheckingOtpStatus; // Specific loading for polling

// --- Default Export ---
export default authSlice.reducer;