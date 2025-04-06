// authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Register User Thunk (Assume it now returns { user: {...}, requestId: '...' })
export const registerUser = createAsyncThunk(
    '/api/auth/signup',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await api.post('/api/auth/signup', formData, {
               headers: { 'Content-Type': 'multipart/form-data', },
               timeout: 15000, // Increase timeout if registration + OTP initiation takes time
            });
            console.log("API Response (Register):", response.data);
            // *** EXPECTING response.data to include requestId ***
            if (!response.data.requestId) {
                 console.warn("requestId missing from registration response");
                 // Decide how to handle this - maybe proceed without polling? Or reject?
                 // For now, let's return the data as is, polling won't start.
            }
            return response.data; // Should contain { user: {...}, requestId: '...' }
        } catch (error) {
            // ... (keep existing error handling) ...
            console.error("API Error (Register):", error.response || error.message || error);
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

// Verify OTP Thunk (Keep as is)
export const verifyOtp = createAsyncThunk(/* ... */); // Keep existing code

// Resend OTP Thunk (Keep as is, or modify if resend also returns a NEW requestId)
export const resendOtp = createAsyncThunk(/* ... */); // Keep existing code

// *** NEW: Thunk to Check OTP Status ***
export const checkOtpStatus = createAsyncThunk(
    '/api/otp-status', // Action type prefix
    async (requestId, { rejectWithValue }) => {
        if (!requestId) {
            return rejectWithValue("No request ID available to check status.");
        }
        try {
            console.log(`Checking OTP status for requestId: ${requestId}`);
            const response = await api.get(`/api/otp-status?requestId=${requestId}`, {
                timeout: 5000, // Short timeout for status check
            });
            console.log("API Response (OTP Status):", response.data);
            // Assuming response.data has a field like 'status' (e.g., 'PENDING', 'SENT', 'FAILED', 'EXPIRED')
            return response.data; // Return the whole status object or just the status string
        } catch (error) {
            console.error("API Error (OTP Status Check):", error.response || error.message || error);
             if (error.code === 'ECONNABORTED') {
                 return rejectWithValue('OTP status check timed out.'); // Specific timeout message
             }
            // Don't flood with errors if backend is temporarily down during polling
            // Return a specific value or structure indicating check failure maybe?
             if (error.response && error.response.status === 404) {
                 return rejectWithValue('OTP request not found or expired.'); // Specific backend error
             }
             // Generic error for other cases
            return rejectWithValue("Failed to check OTP status.");
        }
    }
);


const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        isVerified: false,
        loading: false, // General loading (Register, Verify, Resend)
        error: null, // General/Registration Error
        otpError: null, // OTP Verify/Resend Error / Status Check Error
        otpMessage: null, // OTP Resend Message

        // --- NEW State for OTP Status Polling ---
        otpRequestId: null,      // Store the ID from registration
        otpDeliveryStatus: 'idle', // e.g., 'idle', 'pending_send', 'checking', 'sent', 'failed', 'not_found'
        isCheckingOtpStatus: false, // Specific loading state for the status check poll
        // --- End NEW State ---

        registerFormData: { /* ... */ },
    },
    reducers: {
        updateRegisterFormData: (state, action) => { /* ... */ },
        clearAuthError: (state) => { state.error = null; },
        clearOtpError: (state) => { state.otpError = null; state.otpMessage = null; },
        resetAuthState: (state) => { /* ... reset ALL relevant state fields ... */
             state.user = null;
             state.isVerified = false;
             state.loading = false;
             state.error = null;
             state.otpError = null;
             state.otpMessage = null;
             state.otpRequestId = null; // Reset request ID
             state.otpDeliveryStatus = 'idle'; // Reset status
             state.isCheckingOtpStatus = false; // Reset checking flag
        },
        // Optional: Manually set status if needed
        setOtpDeliveryStatus: (state, action) => {
            state.otpDeliveryStatus = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            // Register User
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.otpError = null;
                state.otpMessage = null;
                state.otpRequestId = null; // Clear old ID
                state.otpDeliveryStatus = 'idle'; // Reset status
                state.isCheckingOtpStatus = false;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user || null; // Ensure user is set
                state.isVerified = false;
                // *** STORE requestId and set initial status ***
                state.otpRequestId = action.payload.requestId || null;
                state.otpDeliveryStatus = action.payload.requestId ? 'pending_send' : 'idle'; // Status depends on having an ID
                state.error = null;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.user = null;
                state.otpRequestId = null;
                state.otpDeliveryStatus = 'idle';
            })

            // Verify OTP (Reset status polling state on success/failure?)
             .addCase(verifyOtp.pending, (state) => {
                state.loading = true; // Use general loading for verify action
                state.otpError = null;
             })
            .addCase(verifyOtp.fulfilled, (state, action) => {
                state.loading = false;
                state.isVerified = true;
                if (action.payload.user) { state.user = action.payload.user; }
                state.otpError = null;
                // Stop polling / Reset status state after successful verification
                state.otpDeliveryStatus = 'verified'; // Mark as verified
                state.isCheckingOtpStatus = false;
                state.otpRequestId = null; // Clear the ID? Optional.
            })
            .addCase(verifyOtp.rejected, (state, action) => {
                state.loading = false;
                state.otpError = action.payload; // Keep OTP error specific
                state.isVerified = false;
                 // Should we stop polling on verify failure? Maybe not, user might retry OTP.
                 // state.isCheckingOtpStatus = false;
            })

            // Resend OTP (Reset status polling state?)
            .addCase(resendOtp.pending, (state) => {
                 state.loading = true; // Or a specific resend loading state
                 state.otpError = null;
                 state.otpMessage = 'Resending OTP...';
                 // Reset status for the new attempt?
                 state.otpDeliveryStatus = 'pending_send'; // Assume resend triggers a new send process
                 state.isCheckingOtpStatus = false; // Stop previous poll if any
                 // state.otpRequestId = null; // Does resend give a *new* ID? If yes, update in fulfilled.
            })
             .addCase(resendOtp.fulfilled, (state, action) => {
                 state.loading = false;
                 state.otpMessage = action.payload.message || 'OTP resent successfully.';
                 state.otpError = null;
                 // If resend provides a new ID, update it here:
                 // state.otpRequestId = action.payload.requestId || state.otpRequestId;
                 // Start polling for the new OTP
                 state.otpDeliveryStatus = state.otpRequestId ? 'pending_send' : 'idle';
            })
            .addCase(resendOtp.rejected, (state, action) => {
                 state.loading = false;
                 state.otpError = action.payload;
                 state.otpMessage = null;
                 // Maybe set status to failed if resend fails?
                 // state.otpDeliveryStatus = 'failed';
            })


            // *** Check OTP Status ***
            .addCase(checkOtpStatus.pending, (state) => {
                state.isCheckingOtpStatus = true;
                 // Don't clear otpError here maybe, let it show verify error until status check succeeds
            })
            .addCase(checkOtpStatus.fulfilled, (state, action) => {
                state.isCheckingOtpStatus = false;
                // ** UPDATE otpDeliveryStatus based on action.payload.status **
                // Example: assuming action.payload is { status: 'SENT' }
                const status = action.payload?.status?.toLowerCase(); // Normalize status
                switch (status) {
                    case 'sent':
                        state.otpDeliveryStatus = 'sent';
                        state.otpError = null; // Clear errors once successfully sent
                        state.otpMessage = 'OTP has been sent.'; // Optional message
                        break;
                    case 'pending':
                        state.otpDeliveryStatus = 'pending_send'; // Still waiting
                        break;
                    case 'failed':
                         state.otpDeliveryStatus = 'failed';
                         state.otpError = 'Failed to send OTP. Please try resending.'; // Set specific error
                         break;
                     case 'expired':
                         state.otpDeliveryStatus = 'expired';
                         state.otpError = 'OTP request expired. Please try resending.';
                         break;
                    // Add other cases based on your backend's possible statuses
                    default:
                        // Keep previous status or set to unknown?
                        console.warn("Unknown OTP status received:", action.payload?.status);
                        // state.otpDeliveryStatus = 'unknown';
                        break;
                }
            })
            .addCase(checkOtpStatus.rejected, (state, action) => {
                state.isCheckingOtpStatus = false;
                // Set error, but maybe don't overwrite a verification error unless it's critical
                // state.otpError = action.payload; // Could be 'Failed to check OTP status.'
                 // If status check fails critically (e.g., 404 Not Found), update status
                 if (action.payload === 'OTP request not found or expired.') {
                     state.otpDeliveryStatus = 'not_found';
                     state.otpError = action.payload;
                 } else {
                     // For temporary errors like timeouts, maybe just log and let polling retry
                     console.warn("OTP Status check failed:", action.payload);
                 }
            });
    },
});

// Export actions and selectors
export const {
    updateRegisterFormData,
    clearAuthError,
    clearOtpError,
    resetAuthState,
    setOtpDeliveryStatus // Export new action if needed
} = authSlice.actions;

// Existing Selectors
export const selectRegisterFormData = (state) => state.auth.registerFormData;
export const selectAuthLoading = (state) => state.auth.loading; // General loading
export const selectAuthError = (state) => state.auth.error; // Registration error
export const selectAuthUser = (state) => state.auth.user;
export const selectIsVerified = (state) => state.auth.isVerified;
export const selectOtpError = (state) => state.auth.otpError; // Verify/Resend/Status errors
export const selectOtpMessage = (state) => state.auth.otpMessage; // Resend message

// --- NEW Selectors ---
export const selectOtpRequestId = (state) => state.auth.otpRequestId;
export const selectOtpDeliveryStatus = (state) => state.auth.otpDeliveryStatus;
export const selectIsCheckingOtpStatus = (state) => state.auth.isCheckingOtpStatus;
// --- End NEW Selectors ---

export default authSlice.reducer;