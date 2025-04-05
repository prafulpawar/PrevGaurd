import {configureStore} from '@reduxjs/toolkit'
import rootReducer from './rootReducer';
const store = configureStore({
     store:rootReducer
})

export default store;