// Redux slice for fetching component options

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

// Get all component options
export const getComponentOptionsFn = createAsyncThunk<any, void>(
  "getComponentOptions",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${url}/design/get-component-options`);
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

// Get component options by type ID
export const getComponentOptionsByTypeFn = createAsyncThunk(
  "getComponentOptionsByType",
  async (typeId: string | number, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${url}/design/get-component-options-by-type/${typeId}`
      );
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
export const getComponentOptionsSlice = createSlice({
  name: "getComponentOptions",
  initialState,
  reducers: {
    resetGetComponentOptions: () => initialState,
  },
  extraReducers: (builder) => {
    // Get all options
    builder.addCase(getComponentOptionsFn.pending, (state) => {
      state.isLoading = true;
      state.isError = false;
      state.isSuccess = false;
    });
    builder.addCase(getComponentOptionsFn.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.data = action.payload;
    });
    builder.addCase(getComponentOptionsFn.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = Object(action.payload);
    });

    // Get options by type
    builder.addCase(getComponentOptionsByTypeFn.pending, (state) => {
      state.isLoading = true;
      state.isError = false;
      state.isSuccess = false;
    });
    builder.addCase(getComponentOptionsByTypeFn.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.data = action.payload;
    });
    builder.addCase(getComponentOptionsByTypeFn.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = Object(action.payload);
    });
  },
});

export const { resetGetComponentOptions } = getComponentOptionsSlice.actions;