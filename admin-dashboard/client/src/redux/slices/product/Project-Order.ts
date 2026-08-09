import { errorMess, url } from "@/redux/API";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";

const initialState = {
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
  data: [],
};

export const updateProjectOrderFn = createAsyncThunk(
  "Project/project-order",
  async (newOrder, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${url}/project/order`, { newOrder });
      return response.data.message;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data?.message || errorMess);
      }
      return rejectWithValue(errorMess);
    }
  }
);

// Slice definition
export const updateOrderProject = createSlice({
  name: "Project",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // ✅ Update order handlers
    builder
      .addCase(updateProjectOrderFn.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = "";
      })
      .addCase(updateProjectOrderFn.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
        // optionally, you could refetch data via getProjectFn
      })
      .addCase(updateProjectOrderFn.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = Object(action.payload);
      });
  },
});
