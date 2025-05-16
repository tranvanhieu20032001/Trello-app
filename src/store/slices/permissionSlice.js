import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  permissionEdit: false
};

const permissionSlice = createSlice({
  name: 'permission',
  initialState,
  reducers: {
    setPermissionEdit: (state, action) => {
      state.permissionEdit = action.payload;
    }
  }
});

export const { setPermissionEdit } = permissionSlice.actions;
export default permissionSlice.reducer;
