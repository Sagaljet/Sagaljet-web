import { errorMess, url } from "../../API";

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";

const initialState = {
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
  data: {},
};

// Async function for sign-up
export const deleteBlogFn = createAsyncThunk(
  "deleteBlog",
  async (id: any, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${url}/blog/delete-blog/${parseInt(id)}`
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.data?.error) {
          return rejectWithValue(error.response.data.error);
        }
        return rejectWithValue(error.response?.data?.message || errorMess);
      }
      return rejectWithValue(errorMess);
    }
  }
);

// Slice definition
export const deleteBlogSlice = createSlice({
  name: "deleteBlog",
  initialState,
  reducers: {
    deleteBlogReset: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(deleteBlogFn.pending, (state) => {
      state.isLoading = true;
      state.isError = false;
      state.isSuccess = false;
    });
    builder.addCase(deleteBlogFn.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.data = action.payload;
    });
    builder.addCase(deleteBlogFn.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = Object(action.payload);
    });
  },
});

export const { deleteBlogReset } = deleteBlogSlice.actions;
