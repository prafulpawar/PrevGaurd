import { createAsyncThunk , createSlice } from "@reduxjs/toolkit";
import api from "../../services/api";


const initialState = {
      savedData : [],
      error:false,
      success:true,
      loading:false,
}

export const getAllShareData = createAsyncThunk(
      'shareData',
      async(_, {rejectWithValue , getState})=>{
            try{

                const state = getState();
                const accessToken = state.auth?.accessToken;

                const response = await api.post('/api/dash/data',{
                      headers:{
                          Authorization: `Bearer ${accessToken}`
                      }
                })
                return response.data
            } 
            catch(error){
                 const message = error?.response?.message?.data || 'Getting Error In Data'
                 return rejectWithValue(message)
            }
      }
)

const shareSlice  = createSlice({
      name:"Slice",
      initialState,
      
      reducers:(state)=>{
         
      },

      extraReducers:(builder)=>{
           builder.addCase(getAllShareData.pending,(state)=>{
                   state.error   = true,
                   state.success = false,
                   state.loading = false
           })
           .addCase(getAllShareData.fulfilled,(state,action)=>{
                   state.error     = false,
                   state.success   = true,
                   state.loading   = false,
                   state.savedData = action.payload;
           })
           .addCase(getAllShareData.rejected,(state)=>{
                   state.error   = true,
                   state.success = false,
                   state.loading = false;
           })
      }
     
})