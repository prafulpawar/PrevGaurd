import {createSlice , createAsyncThunk} from '@reduxjs/toolkit'

const initialState = {
      user:null,
      isLoading:null,
      otpstatus:null,
      error:null,

     //   Now The Redcuers 
     formData:{
          username:"",
          password:"",
          email:"",
          image:null
     }

}

const authSlice = createSlice({
        name:'auth',
        initialState,
        reducers:{
            updateFormData:(state,value)=>{
                 
            }
        },

        extraReducers:(builder)=>{
              
        }
})