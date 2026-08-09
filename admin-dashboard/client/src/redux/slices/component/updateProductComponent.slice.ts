// Redux slice for updating a product component

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

// Async function for updating product component
export const updateProductComponentFn = createAsyncThunk(
  "updateProductComponent",
  async (
    data: {
      id: number | string;
      productId?: number | string;
      optionId?: number | string;
      extraPrice?: number | null;
    },
    { rejectWithValue }
  ) => {
    try {
      const token = JSON.parse(localStorage.getItem("userInfo")!)?.token;

      const { id, ...updateData } = data;

      const response = await axios.put(
        `${url}/design/edit-product-component/${id}`,
        updateData,
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
export const updateProductComponentSlice = createSlice({
  name: "updateProductComponent",
  initialState,
  reducers: {
    resetUpdateProductComponent: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(updateProductComponentFn.pending, (state) => {
      state.isLoading = true;
      state.isError = false;
      state.isSuccess = false;
    });
    builder.addCase(updateProductComponentFn.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.data = action.payload;
    });
    builder.addCase(updateProductComponentFn.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = Object(action.payload);
    });
  },
});

export const { resetUpdateProductComponent } = updateProductComponentSlice.actions;