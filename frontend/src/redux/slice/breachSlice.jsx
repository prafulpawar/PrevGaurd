import {createSlice , createAsyncThunk, } from '@reduxjs/toolkit'
import api from '../../services/api';

const initialState = {
      email:'',
      isLoading:false,
      error:null
}

export const breachData = createAsyncThunk(
    'auth/breach' ,
    async(emailData , {rejectWithValue}) =>{
         try{
             const response = await api.get('/api/breach/check',emailData,{
                headers:{
                    'Content-Type' : 'application/json'
                }
             })
             
         }
         catch(error){

         }
    }
)