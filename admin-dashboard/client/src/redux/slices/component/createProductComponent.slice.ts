// Redux slice for creating product component(s)

import { errorMess, url } from "@/redux/API";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";

const initialState = {
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
  data: {},
};

// Async function for creating single product component
export const createProductComponentFn = createAsyncThunk(
  "createProductComponent",
  async (
    data: { productId: number | string; optionId: number | string; extraPrice?: number },
    { rejectWithValue }
  ) => {
    try {
      const token = JSON.parse(localStorage.getItem("userInfo")!)?.token;

      const response = await axios.post(
        `${url}/design/add-product-component`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
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

// Async function for bulk creating product components
export const createBulkProductComponentsFn = createAsyncThunk(
  "createBulkProductComponents",
  async (
    data: {
      productId: number | string;
      components: Array<{ optionId: number | string; extraPrice?: number }>;
    },
    { rejectWithValue }
  ) => {
    try {
      const token = JSON.parse(localStorage.getItem("userInfo")!)?.token;

      const response = await axios.post(
        `${url}/design/add-bulk-product-components`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
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
export const createProductComponentSlice = createSlice({
  name: "createProductComponent",
  initialState,
  reducers: {
    resetCreateProductComponent: () => initialState,
  },
  extraReducers: (builder) => {
    // Single create
    builder.addCase(createProductComponentFn.pending, (state) => {
      state.isLoading = true;
      state.isError = false;
      state.isSuccess = false;
    });
    builder.addCase(createProductComponentFn.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.data = action.payload;
    });
    builder.addCase(createProductComponentFn.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = Object(action.payload);
    });

    // Bulk create
    builder.addCase(createBulkProductComponentsFn.pending, (state) => {
      state.isLoading = true;
      state.isError = false;
      state.isSuccess = false;
    });
    builder.addCase(createBulkProductComponentsFn.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.data = action.payload;
    });
    builder.addCase(createBulkProductComponentsFn.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = Object(action.payload);
    });
  },
});

export const { resetCreateProductComponent } = createProductComponentSlice.actions;