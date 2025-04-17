import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './slice/authSlice';
import otpReducer from './slice/otpSlice'
import  registerUser  from './slice/registerSlice';
import  breachEmail from './slice/breachSlice'
import   fackDataReducer  from './slice/fakeDataSlice'

const rootReducer = combineReducers({
  auth: authReducer,
  otp:otpReducer,
  register:registerUser,
  breach:breachEmail,
  fakeData: fackDataReducer,

 
});

export default rootReducer;