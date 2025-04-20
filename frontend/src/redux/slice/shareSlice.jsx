import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../services/api";

const initialState = {
    savedData: { data: [] },
    dataRisk: '',
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
            const riskScore = error?.response?.data?.riskScore || '0';
            return rejectWithValue({ message, riskScore });
        }
    }
);

export const deleteAnSahreData = createAsyncThunk(
    'shareData/delete',
    async (deleteId, { rejectWithValue, getState }) => {
        const state = getState();
        const accessToken = state.auth?.accessToken;

        if (!deleteId) {
            console.error("deleteAnSahreData thunk called without a deleteId");
            return rejectWithValue({ message: "No ID provided for deletion.", riskScore: '0' });
        }
         if (!accessToken) {
             return rejectWithValue({ message: 'Access token not found', riskScore: '0' });
         }

        try {
            const response = await api.delete(`/api/dash/delete/${deleteId}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            return response.data;
        } catch (error) {
            console.error("Error deleting data:", error);
            const message = error?.response?.data?.message || error?.message || 'Network Error deleting data';
            const riskScore = error?.response?.data?.riskScore || '0';
            return rejectWithValue({ message, riskScore });
        }
    }
);

export const addAnShareData = createAsyncThunk(
     'shareData/add',
     async(Data,{rejectWithValue,getState})=>{
           const state = getState();
           const accessToken = state.auth?.accessToken
          try{
               const response =await api.post('/api/dash/data', Data , {
                    headers:{
                         Authorization:`Bearer ${accessToken}`
                    }
               })
               return response.data;
          }
          catch(error){
             console.error("Error adding data:", error);
             const message = error?.response?.data?.message || error?.message || 'Network Error';
             const riskScore = error?.response?.data?.riskScore || '0';
             return rejectWithValue({ message, riskScore });
          }
     }
);

export const updateAnShareData = createAsyncThunk(
    'shareData/UpdateOne',
    async(updateData,{rejectWithValue,getState})=>{
           const state = getState();
           const accessToken = state.auth?.accessToken

           try{
              const response = await api.put(`/api/dash/update/${updateData._id}`,updateData,{
                   headers:{
                    Authorization:`Bearer ${accessToken}`
                   }
              });
               return response.data;
           }
           catch(error){
             console.error("Error updating data:", error);
              const message = error?.response?.data?.message || error?.message || 'Network Error ';
              const riskScore = error?.response?.data?.riskScore || '0';
              return rejectWithValue({ message, riskScore });
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
                state.dataRisk = '0';
            })
            .addCase(getAllShareData.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.savedData.data = action.payload.data || [];
                state.dataRisk  = action.payload.riskScore || '0';
                state.message = action.payload.message || 'Data fetched successfully';
            })
            .addCase(getAllShareData.rejected, (state, action) => {
                state.loading = false;
                state.error = true;
                state.message = action.payload.message || 'Failed to fetch data';
                state.savedData = { data: [] };
                state.dataRisk = action.payload.riskScore || '0';
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
                state.message = action.payload.message || "Item Deleted Successfully";
                state.savedData.data = action.payload.data || [];
                state.dataRisk = action.payload.riskScore || '0';
            })
            .addCase(deleteAnSahreData.rejected, (state, action) => {
                state.loading = false;
                state.error = true;
                state.success = false;
                state.message = action.payload.message || 'Failed to delete item';
                state.dataRisk = action.payload.riskScore || '0';
            })

            .addCase(addAnShareData.pending, (state)=>{
                 state.loading = true;
                 state.error = false;
                 state.success = false;
                 state.message = '';
            })
            .addCase(addAnShareData.fulfilled,(state,action)=>{
                 state.loading = false;
                 state.success = true;
                 state.message = action.payload.message || "Item Added Successfully";
                 state.savedData.data = action.payload.data || [];
                 state.dataRisk = action.payload.riskScore || '0';
            })
            .addCase(addAnShareData.rejected,(state,action)=>{
                 state.loading = false;
                 state.error = true;
                 state.success = false;
                 state.message = action.payload.message || 'Failed to add item';
                 state.dataRisk = action.payload.riskScore || '0';
            })

            .addCase(updateAnShareData.pending, (state)=>{
                  state.loading = true;
                  state.error   = false;
                  state.success = false;
                  state.message = '';
            })
            .addCase(updateAnShareData.fulfilled,(state,action)=>{
                   state.loading   = false;
                   state.success   = true;
                   state.message   = action.payload.message || 'Item Updated Sucessfully ';
                   state.savedData.data = action.payload.data || [];
                   state.dataRisk = action.payload.riskScore || '0';
            })
            .addCase(updateAnShareData.rejected,(state,action)=>{
                state.loading = false;
                state.error = true;
                state.success = false;
                state.message = action.payload.message || 'Failed to update item';
                state.dataRisk = action.payload.riskScore || '0';
            })
    }
});


export const { resetShareStatus } = shareSlice.actions;

export const selectError = (state) => state.shareData.error;
export const selectSucess = (state) => state.shareData.success;
export const selectLoading = (state) => state.shareData.loading;
export const selectSuccessData = (state) => state.shareData.savedData;
export const selectMessage = (state) => state.shareData.message;
export const selectDataRisk = (state) =>state.shareData.dataRisk

export default shareSlice.reducer;