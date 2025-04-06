import {createAsyncThunk , createSlice} from '@reduxjs/toolkit'

const initialState = {
    // ye unka data hai jo ki api par depended hai
       name:'auth',
       user:null,
       otpStatus:null,
       loading:false,
       error:null,
      // actions ke liye jo ki direct change hongi 
       formData:{
            username:"",
            email:"",
            password:"",
            confirmPassword: '',
            image:null
       }
}

const authSlice = createSlice({
              name:'auth',
              initialState,

              reducers:{
                  updateRegisterFormData:(state , action) =>{
                       state.formData[action.payload.name] = action.payload.value
                  },
              }
})

// exporting actions
export const {updateRegisterFormData} = authSlice.actions
export const selectRegisterFormData = (state) => state.auth.formData
export default authSlice.reducer