import { errorMess, url } from "../../API";

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";

const initialState = {
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
  data: [],
};

// Async function for sign-up
export const getBlogFn = createAsyncThunk(
  "getBlog",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${url}/blog/all-blogs`);
      return response.data.result;
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.data?.errors) {
          return rejectWithValue(error.response.data.errors);
        }
        return rejectWithValue(error.response?.data?.message || errorMess);
      }
      return rejectWithValue(errorMess);
    }
  }
);

// Slice definition
export const getBlogSlice = createSlice({
  name: "getBlog",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getBlogFn.pending, (state) => {
      state.isLoading = true;
      state.isError = false;
      state.isSuccess = false;
    });
    builder.addCase(getBlogFn.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.data = action.payload;
    });
    builder.addCase(getBlogFn.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = Object(action.payload);
    });
  },
});
