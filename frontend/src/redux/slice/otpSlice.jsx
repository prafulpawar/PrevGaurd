
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

const initialState = {
    otpValue: '',
    otpError: null,
    otpMessage: null,
    isSubmittingOtp: false,
    requestId: null,
    isCheckingStatus: false,
    statusError: null
};

export const verifyOtp = createAsyncThunk(
    'otp/verify',
    async ({ email, otpValue }, { rejectWithValue }) => {
        if (!email) return rejectWithValue('Email is missing.');
        try {
            const response = await api.post('/api/auth/verifyOtp',
                { email, otp: otpValue },
                { headers: { 'Content-Type': 'application/json' } }
            );
            if (!response.data.requestId) return rejectWithValue('Request ID missing.');
            return response.data;
        } catch (error) {
            const msg = error.response?.data?.message || 'OTP Submission Failed';
           
            if (error.response?.status === 400 && msg.toLowerCase().includes('invalid otp')) {
                 return rejectWithValue('Invalid OTP entered.'); 
            }
            return rejectWithValue(msg);
        }
    }
);

export const checkOtpStatus = createAsyncThunk(
    'otp/checkStatus',
    async (requestId, { rejectWithValue }) => {
        if (!requestId) return rejectWithValue('Missing Request ID.');
        try {
            const response = await api.get(`/api/auth/otp-status?requestId=${requestId}`);
            console.log(response)
            return response.data;
        } catch (error) {
            const msg = error.response?.data?.message || 'Failed to check status.';
            return rejectWithValue(msg);
        }
    }
);

const otpSlice = createSlice({
    name: 'otp',
    initialState,
    reducers: {
        updateOtpValue: (state, action) => {
            state.otpValue = action.payload;
            state.otpError = null;
            state.statusError = null;
            state.otpMessage = null;
        },
        resetStatusCheck: (state) => {
             state.requestId = null;
             state.isCheckingStatus = false;
             state.statusError = null;
             state.otpMessage = null;
        },
        resetOtpState: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(verifyOtp.pending, (state) => {
                state.isSubmittingOtp = true;
                state.otpError = null;
                state.statusError = null;
                state.otpMessage = null;
                state.requestId = null;
                state.isCheckingStatus = false;
            })
            .addCase(verifyOtp.fulfilled, (state, action) => {
                state.isSubmittingOtp = false;
                state.requestId = action.payload.requestId;
                state.otpMessage = action.payload.message || 'Processing verification...';
                state.otpError = null;
                state.otpValue = '';
            })
            .addCase(verifyOtp.rejected, (state, action) => {
                state.isSubmittingOtp = false;
                state.otpError = action.payload; 
                state.requestId = null; 
            })
            .addCase(checkOtpStatus.pending, (state) => {
                state.isCheckingStatus = true;
                state.statusError = null;
                state.otpMessage = "Checking verification status...";
            })
            .addCase(checkOtpStatus.fulfilled, (state, action) => {
                state.isCheckingStatus = false;
                state.statusError = null;
                if (action.payload.status !== 'pending') {
                    // Component handles outcome
                } else {
                    state.otpMessage = "Verification in progress...";
                }
            })
            .addCase(checkOtpStatus.rejected, (state, action) => {
                state.isCheckingStatus = false;
                state.statusError = action.payload;
                state.requestId = null;
            });
    }
});

export const { updateOtpValue, resetOtpState, resetStatusCheck } = otpSlice.actions;

export const selectOtpValue = (state) => state.otp.otpValue;
export const selectOtpError = (state) => state.otp.otpError;
export const selectIsSubmittingOtp = (state) => state.otp.isSubmittingOtp;
export const selectOtpMessage = (state) => state.otp.otpMessage;
export const selectRequestId = (state) => state.otp.requestId;
export const selectIsCheckingStatus = (state) => state.otp.isCheckingStatus;
export const selectStatusError = (state) => state.otp.statusError;

export default otpSlice.reducer;