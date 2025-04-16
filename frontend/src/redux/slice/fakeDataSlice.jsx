import { createAsyncThunk , createSlice } from "@reduxjs/toolkit";
import api from "../../services/api";


export const sendFackData = createAsyncThunk(
     '/api/sendData',
     async(savedData,{rejectWithValue})=>{
          try{
             const { accessToken } = getState().auth;
             const response = await api.post('/api/fack-data-generate',savedData,{
                   headers:{
                      Authorization:`Bearer ${accessToken}`
                   }
             })
             return response.data
          } 
          catch(error){
              return rejectWithValue(error.response?.data?.message || 'Failed to fetch user info.'
              )
          }
     }
)

const initialState = {
       data:{
           
       }
}