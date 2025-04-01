import { configureStore } from "@reduxjs/toolkit";
import workSpacReducer from "./slices/workSpaceSlice";
import boardReducer from "./slices/boardSlice";
import authReducer from "./slices/authSlice";
import loadingReducer from "./slices/loadingSlice";

const store = configureStore({
  reducer: {
    workspace: workSpacReducer,
    board: boardReducer,
    auth: authReducer,
    loading: loadingReducer,
  },
});

export default store;
