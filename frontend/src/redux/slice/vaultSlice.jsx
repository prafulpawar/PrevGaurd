import {createAsyncThunk , createSlice} from '@reduxjs/toolkit'
import api from '../../services/api'

const initialState = {
      error:"",
      loading:false,
      data:{},
      savedData:[{}]
}

export const registerVaultThunk = createAsyncThunk(
         'vault/RegisterData',
         async(data,{rejectWithValue, getState})=>{
                   const state = getState();
                   const accessToken = state.auth?.accessToken
               try{
                    const response = await api.post('/api/vault/register',data,{
                          Authorization:`Bearer ${accessToken}`
                    })
                    return response.data
               }
               catch(error){
                    const message = '' ;
                    return rejectWithValue(message)
               }
         }
)

export const vaultSlice = createSlice(
       
)