// Redux slice for fetching product components

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

// Get all product components
export const getProductComponentsFn = createAsyncThunk<any, void>(
  "getProductComponents",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${url}/design/get-product-components`);
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

// Get product components by design ID
export const getProductComponentsByDesignFn = createAsyncThunk(
  "getProductComponentsByDesign",
  async (productId: string | number, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${url}/design/get-product-components-by-design/${productId}`
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
export const getProductComponentsSlice = createSlice({
  name: "getProductComponents",
  initialState,
  reducers: {
    resetGetProductComponents: () => initialState,
  },
  extraReducers: (builder) => {
    // Get all product components
    builder.addCase(getProductComponentsFn.pending, (state) => {
      state.isLoading = true;
      state.isError = false;
      state.isSuccess = false;
    });
    builder.addCase(getProductComponentsFn.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.data = action.payload;
    });
    builder.addCase(getProductComponentsFn.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = Object(action.payload);
    });

    // Get product components by design
    builder.addCase(getProductComponentsByDesignFn.pending, (state) => {
      state.isLoading = true;
      state.isError = false;
      state.isSuccess = false;
    });
    builder.addCase(getProductComponentsByDesignFn.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.data = action.payload;
    });
    builder.addCase(getProductComponentsByDesignFn.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = Object(action.payload);
    });
  },
});

export const { resetGetProductComponents } = getProductComponentsSlice.actions;