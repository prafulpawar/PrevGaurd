import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../services/api';

const initialState = {
  data: {
    name: false,
    email: false,
    phone: false,
    pan: false,
    aadhar: false,
    address: false,
  },
  dataReceived: {
    name: '',
    email: '',
    phone: '',
    pan: '',
    aadhar: '',
    address: '',
  },
  status: 'idle',
  error: null,
};

export const generateData = createAsyncThunk(
  'fake/generateData',
  async (data, { getState, rejectWithValue }) => {
    try {
      const accessToken = getState().auth?.user?.accessToken;
      const response = await api.post('/api/fack-data-generate', data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      console.log('API Response:', response);
      return response.data.data;
    } catch (error) {
      console.error(error);
      return rejectWithValue(error.response?.data?.message || 'Cant Post Data');
    }
  }
);

const fakeDataSlice = createSlice({
  name: 'fake',
  initialState,
  reducers: {
    toggleField: (state, action) => {
      const field = action.payload;
      state.data[field] = !state.data[field];
    },
    resettoggleField: (state) => {
      state.data = {
        name: false,
        email: false,
        phone: false,
        pan: false,
        aadhar: false,
        address: false,
      };
      state.dataReceived = {
        name: '',
        email: '',
        phone: '',
        pan: '',
        aadhar: '',
        address: '',
      };
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(generateData.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(generateData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.dataReceived = action.payload;
      })
      .addCase(generateData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { toggleField, resettoggleField } = fakeDataSlice.actions;

export const SelectMainData = (state) => state.fake.data;
export const SelectGeneratedData = (state) => state.fake.dataReceived;
export const SelectStatusData = (state) => state.fake.status;
export const SelectErrorData = (state) => state.fake.error;

export default fakeDataSlice.reducer;
