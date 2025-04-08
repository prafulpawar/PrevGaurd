import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './slice/authSlice';
import otpReducer from './slice/otpSlice'
// import userReducer from './userSlice'; // मान लें कि आपके पास userSlice भी है

const rootReducer = combineReducers({
  auth: authReducer,
  otp:otpReducer
//   user: userReducer,
});

export default rootReducer;