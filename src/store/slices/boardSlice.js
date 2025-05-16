import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";;
import { fetchBoardById_API } from "~/apis";

export const fetchBoardById = createAsyncThunk(
  "board/fetchBoardById",
  async (boardId, { rejectWithValue }) => {
    try {
      const response = await fetchBoardById_API(boardId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch board");
    }
  }
);

const boardSlice = createSlice({
  name: "board",
  initialState: {
    board: null,
    loading: false,
    error: null,
    shouldUpdate: false,
  },
  reducers: {
    clearBoard: (state) => {
      state.board = null;
      state.error = null;
    },
    triggerUpdate: (state) => {
      state.shouldUpdate = true;
    },
    resetUpdate: (state) => {
      state.shouldUpdate = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBoardById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBoardById.fulfilled, (state, action) => {
        state.loading = false;
        state.board = action.payload;
        state.shouldUpdate = false;
      })
      .addCase(fetchBoardById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearBoard } = boardSlice.actions;
export default boardSlice.reducer;
