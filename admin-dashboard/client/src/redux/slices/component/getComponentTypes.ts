// Redux slice for fetching all component types

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

// Async function for getting all component types
export const getComponentTypesFn = createAsyncThunk<any, void>(
  "getComponentTypes",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${url}/design/get-component-types`);
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
export const getComponentTypesSlice = createSlice({
  name: "getComponentTypes",
  initialState,
  reducers: {
    resetGetComponentTypes: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(getComponentTypesFn.pending, (state) => {
      state.isLoading = true;
      state.isError = false;
      state.isSuccess = false;
    });
    builder.addCase(getComponentTypesFn.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.data = action.payload;
    });
    builder.addCase(getComponentTypesFn.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = Object(action.payload);
    });
  },
});

export const { resetGetComponentTypes } = getComponentTypesSlice.actions;