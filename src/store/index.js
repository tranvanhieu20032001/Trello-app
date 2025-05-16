import { configureStore } from "@reduxjs/toolkit";
import workSpacReducer from "./slices/workSpaceSlice";
import boardReducer from "./slices/boardSlice";
import authReducer from "./slices/authSlice";
import loadingReducer from "./slices/loadingSlice";
import modalReducer from "./slices/modalSlice";
import filterReducer from "./slices/filterSlice";
import permissionReducer from './slices/permissionSlice';

const store = configureStore({
  reducer: {
    workspace: workSpacReducer,
    board: boardReducer,
    auth: authReducer,
    loading: loadingReducer,
    modal: modalReducer,
    filter: filterReducer,
    permission: permissionReducer,
  },
});

export default store;
