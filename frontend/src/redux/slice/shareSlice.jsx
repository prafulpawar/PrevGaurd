import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../services/api";

// Initial State
const initialState = {
    savedData: { data: [] }, 
    error: false,
    success: false,
    loading: false, 
    message: '',
};

export const getAllShareData = createAsyncThunk(
    'shareData/getAll', 
    async (_, { rejectWithValue, getState }) => {
        const state = getState();
       
        const accessToken = state.auth?.accessToken;
        if (!accessToken) {
             return rejectWithValue('Access token not found');
        }
        try {
            const response = await api.get('/api/dash/data', {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
           
            return response.data;
        } catch (error) {
            console.error("Error fetching data:", error);
            const message = error?.response?.data?.message || error?.message || 'Network Error fetching data';
            return rejectWithValue(message);
        }
    }
);


export const deleteAnSahreData = createAsyncThunk(
    'shareData/delete', // More specific type prefix
    async (deleteId, { rejectWithValue, getState }) => {
        const state = getState();
        const accessToken = state.auth?.accessToken;

        if (!deleteId) {
            console.error("deleteAnSahreData thunk called without a deleteId");
            return rejectWithValue("No ID provided for deletion.");
        }
         if (!accessToken) {
             return rejectWithValue('Access token not found');
         }

        try {
            const response = await api.delete(`/api/dash/delete/${deleteId}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
         
            return { deletedId: deleteId, message: response.data.message || "Item Deleted Successfully" };
        } catch (error) {
            console.error("Error deleting data:", error);
            const message = error?.response?.data?.message || error?.message || 'Network Error deleting data';
            return rejectWithValue(message);
        }
    }
);


const shareSlice = createSlice({
    name: "shareData", 
    initialState,
    reducers: {
       
        resetShareStatus: (state) => {
             state.error = false;
             state.success = false;
             state.message = '';
           
        }
    },
    extraReducers: (builder) => {
        builder
           
            .addCase(getAllShareData.pending, (state) => {
                state.loading = true;
                state.error = false;
                state.success = false;
                state.message = ''; 
            })
            .addCase(getAllShareData.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.savedData = action.payload || { data: [] }; 
            })
            .addCase(getAllShareData.rejected, (state, action) => {
                state.loading = false;
                state.error = true;
                state.message = action.payload || 'Failed to fetch data';
                state.savedData = { data: [] }; 
            })

            .addCase(deleteAnSahreData.pending, (state) => {
                state.loading = true;
                state.error = false;
                state.success = false; 
                state.message = '';
            })
            .addCase(deleteAnSahreData.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = action.payload.message;
                if (state.savedData && state.savedData.data && deletedId) {
                    state.savedData.data = state.savedData.data.filter(
                        item => item._id !== deletedId
                    );
                }
            })
            .addCase(deleteAnSahreData.rejected, (state, action) => {
                state.loading = false;
                state.error = true;
                state.success = false; 
                state.message = action.payload || 'Failed to delete item';
            });
    }
});


export const { resetShareStatus } = shareSlice.actions;

// Selectors
export const selectError = (state) => state.shareData.error;
export const selectSucess = (state) => state.shareData.success;
export const selectLoading = (state) => state.shareData.loading;
export const selectSuccessData = (state) => state.shareData.savedData; 
export const selectMessage = (state) => state.shareData.message;

// Export the reducer
export default shareSlice.reducer;