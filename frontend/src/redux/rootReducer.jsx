import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './slice/authSlice';
// import userReducer from './userSlice'; // मान लें कि आपके पास userSlice भी है

const rootReducer = combineReducers({
  auth: authReducer,
//   user: userReducer,
});

export default rootReducer;