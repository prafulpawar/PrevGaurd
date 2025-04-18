import { createAsyncThunk , createSlice } from "@reduxjs/toolkit";


const initialState = {
      
}

export const getAllShareData = createAsyncThunk(
      'shareData',
      async(_, {rejectWithValue , getState})=>{
            try{
                
            } 
            catch(error){
                 const message = error?.response?.message?.data || 'Getting Error In Data'
            }
      }
)