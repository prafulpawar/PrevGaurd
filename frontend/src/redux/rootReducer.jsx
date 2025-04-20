import { combineReducers } from  '@reduxjs/toolkit';
import   authReducer       from  './slice/authSlice';
import   otpReducer        from  './slice/otpSlice'
import   registerUser      from  './slice/registerSlice';
import   breachEmail       from  './slice/breachSlice';
import   fackDataReducer   from  './slice/fakeDataSlice';
import   shareSlice        from  './slice/shareSlice';
import   vaultData         from   './slice/vaultSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  otp:otpReducer,
  register:registerUser,
  breach:breachEmail,
  fakeData: fackDataReducer,
  shareData:shareSlice,
  vaultData:vaultData
});

export default rootReducer;