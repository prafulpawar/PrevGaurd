import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../services/api";

export const sendFakeData = createAsyncThunk(
    'fakeData/send',
    async (data, { rejectWithValue, getState }) => {
        try {
            const state = getState();
            const accessToken = state.auth?.accessToken;

            if (!accessToken) {
                return rejectWithValue('Authentication token not found.');
            }

            const response = await api.post('/api/fack-data-generate', data, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            return response.data?.data;
        } catch (error) {
            const message = error.response?.data?.message || error.message || 'Failed to generate data.';
            return rejectWithValue(message);
        }
    }
);

export const saveFakeData = createAsyncThunk(
    'fakeData/save',
    async (payload, { rejectWithValue, getState }) => {
        try {
            const state = getState();
            const accessToken = state.auth?.accessToken;

            if (!accessToken) {
                return rejectWithValue('Authentication token not found.');
            }

            const dataToSend = {
                ...payload.generatedData,
                savedBy: payload.savedBy
            };

            const response = await api.post('/api/fack-data', dataToSend, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                }
            });

            return response.data?.message || "Data saved successfully!";
        } catch (error) {
            const message = error.response?.data?.message || error.message || 'Failed To Save Data!!';
            return rejectWithValue(message);
        }
    }
);

export const getallSavedFackData = createAsyncThunk(
  'fackData',
  async (_, { rejectWithValue, getState }) => {  
   
    try {
      const state = getState();
      const accessToken = state.auth?.accessToken;
    
      if (!accessToken) {
        return rejectWithValue('Authentication token not found.');
      }

      const response = await api.get('/api/fack-data-allpost', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
     
      return response.data;
    } catch (error) {
      console.log(error)
      const message =
        error.response?.data?.message || error.message || 'Failed To Get Saved Data!';
      return rejectWithValue(message);
    }
  }
);

export const deleteSavedData = createAsyncThunk(
     'fackData/delete',
     async(deleteData , {rejectWithValue})=>{
          try{
              const state = getState();
              const accessToken = state.auth?.accessToken;

              if(!accessToken){
                return rejectWithValue('Authentication token not found.');
              }

              const response =await api.delete(`/api/fack-data/${deleteData}`,{
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              })

              return response.data
          }
          catch(error){
              const message = error.response?.data?.message || error.message || 'Failed To Delete Data!!'
             return  rejectWithValue(message)
          }
     }
)



const initialState = {
    data: {
        name: false,
        email: false,
        phone: false,
        pan: false,
        aadhar: false,
        address: false,
    },
    allSavedFackData:[],
    response: {},
    loading: false,
    success: false,
    error: false,
    message: '',
    deleteData:''
};

const fakeDataSlice = createSlice({
    name: 'fakeData',
    initialState,
    reducers: {
        updateFakeData: (state, action) => {
            state.data = { ...state.data, ...action.payload };
        },
        resetFakeData: (state) => {
            state.data = initialState.data;
            state.response = initialState.response;
            state.loading = initialState.loading;
            state.success = initialState.success;
            state.error = initialState.error;
            state.message = initialState.message;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(sendFakeData.pending, (state) => {
                state.loading = true;
                state.success = false;
                state.error = false;
                state.message = '';
                state.response = {};
            })
            .addCase(sendFakeData.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.response = action.payload;
                state.message = "Data generated.";
            })
            .addCase(sendFakeData.rejected, (state, action) => {
                state.loading = false;
                state.error = true;
                state.success = false;
                state.message = action.payload;
                state.response = {};
            })
            .addCase(saveFakeData.pending, (state) => {
                state.loading = true;
                state.success = false;
                state.error = false;
                state.message = '';
            })
            .addCase(saveFakeData.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = action.payload;
            })
            .addCase(saveFakeData.rejected, (state, action) => {
                state.loading = false;
                state.error = true;
                state.success = false;
                state.message = action.payload;
            })
            .addCase(getallSavedFackData.pending,(state)=>{
                 state.loading = false;
                 state.success = false;
                 state.error   = false;
                 state.message = ''; 
            })
            .addCase(getallSavedFackData.fulfilled,(state,action)=>{
                  state.loading = false;
                  state.success = true;
                  state.allSavedFackData = action.payload;
                  state.message = ''; 
            })
            .addCase(getallSavedFackData.rejected,(state,action)=>{
                     state.loading = false; 
                     state.error   = true;
                     state.success = false;
                     state.message = action.payload;
           })
           .addCase(deleteSavedData.pending , (state)=>{
                state.loading = false;
                state.success = false;
                state.error   = false;
                state.message = ''; 
           })
           .addCase(deleteSavedData.fulfilled, (state,action)=>{
                  state.loading = false;
                  state.success = true;
                  state.deleteData = action.payload;

           })
           .addCase(deleteSavedData.rejected,(state,action)=>{
                   state.loading = false; 
                   state.error   = true;
                   state.success = false;
                   state.message = action.payload;
           })
    }
});

export const { updateFakeData, resetFakeData } = fakeDataSlice.actions;

export const selectInitialData = (state) => state.fakeData.data;
export const selectSuccessData = (state) => state.fakeData.success;
export const selectResponseData = (state) => state.fakeData.response;
export const selectLoading = (state) => state.fakeData.loading;
export const selectMessage = (state) => state.fakeData.message;
export const selectError = (state) => state.fakeData.error;
export const selectAllFackData = (state)=> state.fakeData.allSavedFackData;
export const selectDeleteData = (state) => state.fakeData.deleteData

export default fakeDataSlice.reducer;
