import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  members: [],
  status: null,
  dueDate: [],
  labels: [],
};

const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    setMembersFilter(state, action) {
      state.members = action.payload;
    },
    setStatusFilter(state, action) {
      state.status = action.payload;
    },
    setDueDateFilter(state, action) {
      state.dueDate = action.payload;
    },
    setLabelsFilter(state, action) {
      state.labels = action.payload;
    },
    clearAllFilters(state) {
      state.members = [];
      state.status = [];
      state.dueDate = [];
      state.labels = [];
    },
  },
});

export const {
  setMembersFilter,
  setStatusFilter,
  setDueDateFilter,
  setLabelsFilter,
  clearAllFilters,
} = filterSlice.actions;

export default filterSlice.reducer;
