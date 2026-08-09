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
export const deleteCategoryFn = createAsyncThunk(
  "deleteCategory",
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${url}/categories/delete-category/${id}`
      );
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
export const deleteCategorySlice = createSlice({
  name: "deleteCategory",
  initialState,
  reducers: {
    deleteCategoryReset: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(deleteCategoryFn.pending, (state) => {
      state.isLoading = true;
      state.isError = false;
      state.isSuccess = false;
    });
    builder.addCase(deleteCategoryFn.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.data = action.payload;
    });
    builder.addCase(deleteCategoryFn.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = Object(action.payload);
    });
  },
});

export const { deleteCategoryReset } = deleteCategorySlice.actions;
