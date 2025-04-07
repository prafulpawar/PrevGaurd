import {createAsyncThunk , createSlice}  from '@reduxjs/toolkit'

const initialState = {
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
             updateFormData:(state,payload)=>{
                
             }
       },

       extraReducers:(builder)=>{

       }
})


// actions
export const {updateFormData} = authSlice.actions

export default authSlice.reducer