import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './slice/authSlice';
import otpReducer from './slice/otpSlice'
// import userReducer from './userSlice'; // मान लें कि आपके पास userSlice भी है
import  registerUser  from './slice/registerSlice';
import  breachEmail from './slice/breachSlice'
import  fackData from './slice/fakeDataSlice'

const rootReducer = combineReducers({
  auth: authReducer,
  otp:otpReducer,
  register:registerUser,
  breach:breachEmail,
  fake: fackData,

 
//   user: userReducer,
});

export default rootReducer;