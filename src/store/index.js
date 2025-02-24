import { configureStore } from '@reduxjs/toolkit';
import boardReducer from './slices/boardSlice'
import authReducer from './slices/authSlice'
import loadingReducer from './slices/loadingSlice';

const store = configureStore({
  reducer: {
    board: boardReducer,
    auth:authReducer,
    loading: loadingReducer,
  },
});

export default store;
