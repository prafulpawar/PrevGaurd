import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../services/api";

const initialState = {
    otpValue: '',
    otpError: null,
    otpMessage: null,
    isLoading: false,
    isVerified: false,
};

export const verifyOtp = createAsyncThunk(
    'otp/verify',
    async (otpValue, { rejectWithValue }) => {
        try {
            const response = await api.post('/api/auth/verifyOpt',
                { otp: otpValue },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'OTP Verification Failed';
            return rejectWithValue(errorMessage);
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
            state.otpMessage = null;
        },
        resetOtpState: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(verifyOtp.pending, (state) => {
                state.isLoading = true;
                state.otpError = null;
                state.otpMessage = null;
                state.isVerified = false;
            })
            .addCase(verifyOtp.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isVerified = true;
                state.otpMessage = action.payload?.message || 'OTP Verified Successfully!';
                state.otpError = null;
            })
            .addCase(verifyOtp.rejected, (state, action) => {
                state.isLoading = false;
                state.isVerified = false;
                state.otpError = action.payload;
                state.otpMessage = null;
            });
    }
});

export const { updateOtpValue, resetOtpState } = otpSlice.actions;

export const selectOtpValue = (state) => state.otp.otpValue;
export const selectOtpError = (state) => state.otp.otpError;
export const selectIsLoading = (state) => state.otp.isLoading;
export const selectOtpMessage = (state) => state.otp.otpMessage;
export const selectIsVerified = (state) => state.otp.isVerified;

export default otpSlice.reducer;