import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../services/api';

const initialState = {
    success:false,
    error: "",
    loading: false,
    data: {},
    savedData: [{}],
};

export const registerVaultThunk = createAsyncThunk(
    'vault/RegisterData',
    async (data, { rejectWithValue, getState }) => {
        const state = getState();
        const accessToken = state.auth?.accessToken;

        try {
            const response = await api.post('/api/vault/register', data, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            return response.data;
        } catch (error) {
            const message = error.response?.data?.message || error.message || 'Something went wrong';
            return rejectWithValue(message);
        }
    }
);

const vaultSlice = createSlice({
    name: "vault",
    initialState,
    reducers: {
        
    },
    extraReducers: (builder) => {
        builder
            .addCase(registerVaultThunk.pending, (state) => {
                state.success=false,
                state.loading = true;
                state.error = "";
            })
            .addCase(registerVaultThunk.fulfilled, (state, action) => {
                state.success = true
                state.loading = false;
                state.data = action.payload;
               
            })
            .addCase(registerVaultThunk.rejected, (state, action) => {
                state.success = false,
                state.loading = false;
                state.error = action.payload || "Failed to register vault data";
            });
    }
});




export const selectVaultSucess  = (state) => state.vaultData.success
export const selectVaultError   = (state) => state.vaultData.error
export const selectVaultLoading = (state) => state.vaultData.loading

export default vaultSlice.reducer;