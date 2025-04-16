import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../services/api";

// Async thunk for sending data
export const sendFackData = createAsyncThunk(
  '/api/sendData',
  async (data, { rejectWithValue, getState }) => { 
    try {
      const { auth: { accessToken } } = getState(); 
      const response = await api.post('/api/fack-data-generate', data, {
        headers: {
          Authorization: `Bearer ${accessToken}`, 
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to send data.');
    }
  }
);

const initialState = {
  data: {
    name: '',
    email: '',
    phone: '',
    pan: '',
    aadhar: '',
    address: ''
  },
  saveData: {
    savedAs: '',
    name: '',
    email: '',
    phone: '',
    pan: '',
    aadhar: '',
    address: ''
  },
  error: false,
  loading: false,
  success: false
};

// Slice for managing fack data
const fackDataSlice = createSlice({
  name: 'fackData',
  initialState,
  reducers: {
    updateFackData: (state, action) => {
      state.data = action.payload;
    },
    saveFackData: (state, action) => {
      state.saveData = action.payload;
    },
    resetFackData: (state) => {
      state.data = {      
        name: '',
        email: '',
        phone: '',
        pan: '',
        aadhar: '',
        address: ''
      };
      state.saveData = {
        savedAs: '',
        name: '',
        email: '',
        phone: '',
        pan: '',
        aadhar: '',
        address: ''
      };
      state.error = false;    
      state.loading = false;
      state.success = false;
    },
    showFackData: (state, action) => {
      state.data = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendFackData.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = false;
      })
      .addCase(sendFackData.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = false;
        state.data = action.payload;
      })
      .addCase(sendFackData.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = true;
        state.message = action.payload; // Added message state.
      });
  },
});

// Export actions and reducer
export const { updateFackData, saveFackData, resetFackData, showFackData } = fackDataSlice.actions;
export const fackDataReducer = fackDataSlice.reducer;
