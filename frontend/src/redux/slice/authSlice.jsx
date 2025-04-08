import {createAsyncThunk , createSlice}  from '@reduxjs/toolkit'

const initialState = {
      Iserror:null,
      isLoading:false,
      formData:{
           username:'',
           email:"",
           password:"",
           confirmPassword:"",
           image:null
      }

}

const authSlice = createSlice({
       name:'auth',
       initialState,
       
       reducers:{

             updateFormData:(state,action)=>{

                   console.log(action.payload);

                state.formData = action.payload
             }
       },

       extraReducers:(builder)=>{

       }
})


// actions
export const {updateFormData} = authSlice.actions

// state 
export const setFormData = (state) => state.auth.formData
export const Ierror = (state) => state.auth.Iserror
export const isLoading = (state) => state.auth.isLoading
export default authSlice.reducer