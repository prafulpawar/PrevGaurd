import { createAsyncThunk , createSlice } from "@reduxjs/toolkit";
import api from "../../services/api";


const initialState = {
      savedData : [],
      error:false,
      success:false,
      loading:true,
      message:'',
}

export const getAllShareData = createAsyncThunk(
      'shareData',
      async(_, {rejectWithValue , getState})=>{
            try{

                const state = getState();
                const accessToken = state.auth?.accessToken;
                const response = await api.get('/api/dash/data',{
                      headers:{
                          Authorization: `Bearer ${accessToken}`
                      }
                })
                return response.data
            } 
            catch(error){
                  console.log(error)
                 const message = error?.response?.message?.data || 'Network Error '
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
           builder.addCase(getAllShareData.pending,(state,action)=>{
                   state.error   = true,
                   state.success = false,
                   state.loading = false,
                   state.message = action.payload
           })
           .addCase(getAllShareData.fulfilled,(state,action)=>{
                   state.error     = false,
                   state.success   = true,
                   state.loading   = false,
                   state.savedData = action.payload;
           })
           .addCase(getAllShareData.rejected,(state,action)=>{
                   state.error   = true,
                   state.success = false,
                   state.loading = false;
                   state.message = action.payload
           })
      }
     
})


export const selectError   = (state) => state.shareData.error;
export const selectSucess  = (state) => state.shareData.success;
export const selectLoading = (state) => state.shareData.loading;
export const selectSuccessData = (state) =>state.shareData.savedData;
export const selectMessage  = (state) =>state.shareData.message;
export default shareSlice.reducer;