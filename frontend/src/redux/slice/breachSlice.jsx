import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api'; 
const initialState = {
    emailData: '', 
    isLoading: false, 
    error: null,    
    data: null,   
};


export const fetchBreachData = createAsyncThunk(
    'breach/fetch', 
    async (email, { rejectWithValue }) => { 
        if (!email) {
            return rejectWithValue('Email is required');
        }
       
        try {
          
            const response = await api.get('/api/breach/check', {
                params: { email: email }, 
            });
           
            return response.data;
        } catch (error) {
         
            console.error("API Error fetching breach data:", error);
          
            const errorMessage = error.response?.data?.message || error.message || 'Error In Getting Data';
            return rejectWithValue(errorMessage);
        }
    }
);

// Create the Redux slice
const breachSlice = createSlice({
    name: 'breach',
    initialState,  
    reducers: {
    
        updateEmailValue: (state, action) => {
            state.emailData = action.payload;
         
            state.isLoading = false;
            state.error = null;
            state.data = null;
        },
         
        resetBreachState: () => initialState,
    },
   
    extraReducers: (builder) => {
        builder
           
            .addCase(fetchBreachData.pending, (state) => {
                state.isLoading = true;
                state.error = null; 
                state.data = null;
            })
           
            .addCase(fetchBreachData.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = action.payload;
                state.error = null;
            })
          
            .addCase(fetchBreachData.rejected, (state, action) => {
                state.isLoading = false;
            
                state.error = action.payload;
                state.data = null; 
            });
    },
});


export const { updateEmailValue, resetBreachState } = breachSlice.actions;


export const selectBreachEmail = (state) => state.breach.emailData;
export const selectBreachData = (state) => state.breach.data;
export const selectBreachIsLoading = (state) => state.breach.isLoading;
export const selectBreachError = (state) => state.breach.error;
export const selectEntireBreachState = (state) => state.breach; 


export default breachSlice.reducer;