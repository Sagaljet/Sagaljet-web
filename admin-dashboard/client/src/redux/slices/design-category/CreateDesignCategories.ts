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
export const createDesignCategoryFn = createAsyncThunk(
  "createCategoryDesign/api",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${url}/categories/design/add-category`, data);
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
export const createDesignCategorySlice = createSlice({
  name: "createCategory",
  initialState,
  reducers: {
    resetCreateCategoryDesign: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(createDesignCategoryFn.pending, (state) => {
      state.isLoading = true;
      state.isError = false;
      state.isSuccess = false;
    });
    builder.addCase(createDesignCategoryFn.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.data = action.payload;
    });
    builder.addCase(createDesignCategoryFn.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = Object(action.payload);
    });
  },
});

export const { resetCreateCategoryDesign } = createDesignCategorySlice.actions;
