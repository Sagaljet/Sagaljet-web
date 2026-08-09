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
export const createCategoryFn = createAsyncThunk(
  "createCategory",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${url}/categories/add-category`, data);
      return response.data;
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
export const createCategorySlice = createSlice({
  name: "createCategory",
  initialState,
  reducers: {
    resetCreateCategory: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(createCategoryFn.pending, (state) => {
      state.isLoading = true;
      state.isError = false;
      state.isSuccess = false;
    });
    builder.addCase(createCategoryFn.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.data = action.payload;
    });
    builder.addCase(createCategoryFn.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = Object(action.payload);
    });
  },
});

export const { resetCreateCategory } = createCategorySlice.actions;
