import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../services/api';

const initialState = {
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
                state.loading = true;
                state.error = "";
            })
            .addCase(registerVaultThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
               
            })
            .addCase(registerVaultThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to register vault data";
            });
    }
});

export default vaultSlice.reducer;


export const selectRegisterVault = (state) => state.