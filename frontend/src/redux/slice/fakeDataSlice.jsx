import {createAsyncThunk , createSlice} from '@reduxjs/toolkit'
import api from '../../services/api'

const initialState = {
      data:{
        name : false,
        email : false,
        phone : false,
        pan : false,
        addhar : false, 
        address : false
      },
      status:'idle',
      error:null
}

export const generateData = createAsyncThunk(
    '/api/generateData',
    async(data,{getState ,rejectWithValue}) =>{
         try{
            const accessToken = getState().auth?.user?.accessToken;

            console.log(accessToken)
             const response = await api.post('/api/fack-data-generate', data, {
                headers: {
                   
                    Authorization: `Bearer ${accessToken}`
                },
              });
              
               console.log(response)
             return response.data;
         }
         catch(error){
             console.log(error)
             return rejectWithValue(error.response?.data?.message || 'Cant Post Data')
         }
})

const fackDataSlice = createSlice({
       name:'fackData',
       initialState,
       reducers:{
            // actions
            toggleField:(state,action)=>{
                  
                 const field = action.payload;
                 state.data[field] = !state.data[field]
            }
       },
       extraReducers:(builder) =>{
           builder.addCase(generateData.pending ,(state)=>{
                   state.status = 'loading',
                   state.error  = null;
           })

           .addCase(generateData.fulfilled ,(state , action)=>{
                   state.status = 'loading',
                   state.data  = action.payload;
           })
           .addCase(generateData.rejected , (state,action)=>{
                   state.status = 'failed',
                   state.error = action.payload
           })           
       }

})

export const {toggleField} = fackDataSlice.actions;
export const SelectMainData = (state) => state.breach.data
export const SelectStatusData = (state) => state.breach.status
export const SelectErrorData = (state) =>state.breach.error

export default fackDataSlice.reducer;
