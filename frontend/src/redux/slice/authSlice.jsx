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
            updateFormData:(state,action)=>{
                state.formData[action.payload.name] = action.payload.value
            }
        },

        extraReducers:(builder)=>{
             
        }
})

// actions
export const {updateFormData} = authSlice.actions

//states
export const initialFomData = (state) => state.auth.formData 

//exporting silice
export default authSlice.reducer