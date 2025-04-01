import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getWorkspaceById_API } from "~/apis";
import { startLoading, stopLoading } from "~/store/slices/loadingSlice";

// Async action để fetch dữ liệu workspace
export const fetchWorkspaceData = createAsyncThunk(
  "workspace/fetchWorkspaceData",
  async (id, { dispatch, rejectWithValue }) => {
    if (!id) return rejectWithValue("Invalid workspace ID");
    dispatch(startLoading());
    try {
      const response = await getWorkspaceById_API(id);
      return response.data.data;
    } catch (error) {
      return rejectWithValue("Failed to fetch workspace data");
    } finally {
      setTimeout(() => {
        dispatch(stopLoading());
      }, 800);
    }
  }
);

const workspaceSlice = createSlice({
  name: "workspace",
  initialState: {
    workspaceData: null,
    workspaceName: "",
    error: null,
  },
  reducers: {
    setWorkspaceName: (state, action) => {
      state.workspaceName = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWorkspaceData.fulfilled, (state, action) => {
        state.workspaceData = action.payload;
        state.workspaceName = action.payload?.name || "";
        state.error = null;
      })
      .addCase(fetchWorkspaceData.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { setWorkspaceName } = workspaceSlice.actions;
export default workspaceSlice.reducer;
