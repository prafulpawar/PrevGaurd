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
            
             updateFormData:(state,action)=>{
                
             }
       },

       extraReducers:(builder)=>{

       }
})


// actions
export const {updateFormData} = authSlice.actions

// state 
export const setFormData = (state) => state.auth.formData

export default authSlice.reducer