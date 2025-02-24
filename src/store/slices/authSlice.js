import { createSlice } from "@reduxjs/toolkit";

const loadFromLocalStorage = (key) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error(`Error loading ${key} from localStorage`, error);
    return null;
  }
};

const initialState = {
  user: loadFromLocalStorage("user"),
  accessToken: localStorage.getItem("accessToken") || null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;

      // Lưu vào localStorage
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      localStorage.setItem("accessToken", action.payload.accessToken);
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;

      // Xóa khỏi localStorage
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
    },
    refreshToken: (state, action) => {
      state.accessToken = action.payload;
      localStorage.setItem("accessToken", action.payload);
    },
  },
});

export const { setUser, logout, refreshToken } = authSlice.actions;
export default authSlice.reducer;
