import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../services/api';

const initialState = {
  Iserror: null,
  isLoading: false,
  email:"",
  formData: {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    image: null,
  },
};

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (formData, { rejectWithValue }) => {
    console.log(formData)
    try {
      const response = await api.post('/api/auth/signup', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log(response)
      return response.data;
    } catch (error) {
      console.log(error)
      return rejectWithValue(error.response?.data?.message || 'Signup failed');
    }
  }
);




const registerSlice = createSlice({
  name: 'register',
  initialState,
  reducers: {
    updateFormData: (state, action) => {
      state.formData = { ...state.formData, [action.payload.field]: action.payload.value };
    },
    clearError: (state) => {
      state.Iserror = null;
    },
    updateOtp:(state,action)=>{
       state.otp=action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.Iserror = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.email =action.payload.email
        state.formData = {
          username: '',
          email: '',
          password: '',
          confirmPassword: '',
          image: null,
        };
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.Iserror = action.payload;
      })

    


  },
});

export const { updateFormData, clearError } = registerSlice.actions;

export const setFormData = (state) => state.register.formData;
export const Ierror = (state) => state.register.Iserror;
export const isLoading = (state) => state.register.isLoading;
export const getemail = (state) => state.register.email;

export default registerSlice.reducer;