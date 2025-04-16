import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../services/api";

// Async thunk
export const sendFackData = createAsyncThunk(
  'fackData/send',
  async (data, { rejectWithValue, getState }) => {
    try {
      const { auth: { accessToken } } = getState();
      const response = await api.post('/api/fack-data-generate', data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to send data.');
    }
  }
);

const initialState = {
  data: {
    name: false,
    email: false,
    phone: false,
    pan: false,
    aadhar: false,
    address: false,
  },
  response: {},
  loading: false,
  success: false,
  error: false,
  message: ''
};

const fackDataSlice = createSlice({
  name: 'fackData',
  initialState,
  reducers: {
    updateFackData: (state, action) => {
      state.data = { ...state.data, ...action.payload };
    },
    resetFackData: (state) => {
      state.data = {
        name: false,
        email: false,
        phone: false,
        pan: false,
        aadhar: false,
        address: false,
      };
      state.response = {};
      state.loading = false;
      state.success = false;
      state.error = false;
      state.message = '';
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
        state.response = action.payload;
      })
      .addCase(sendFackData.rejected, (state, action) => {
        state.loading = false;
        state.error = true;
        state.message = action.payload;
      });
  }
});

export const { updateFackData, resetFackData } = fackDataSlice.actions;

export const selectInitialData = (state) => state.fack.data;
export const selectSucessData = (state) => state.fack.success;
export const selectResponseData = (state) => state.fack.response;
export default  fackDataSlice.reducer;
