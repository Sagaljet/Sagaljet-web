// Redux slice for deleting product component(s)

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

// Async function for deleting single product component
export const deleteProductComponentFn = createAsyncThunk(
  "deleteProductComponent",
  async (id: any, { rejectWithValue }) => {
    try {
      const token = JSON.parse(localStorage.getItem("userInfo")!)?.token;

      const response = await axios.delete(
        `${url}/design/delete-product-component/${parseInt(id)}`,
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

// Async function for deleting all product components by design
export const deleteProductComponentsByDesignFn = createAsyncThunk(
  "deleteProductComponentsByDesign",
  async (productId: any, { rejectWithValue }) => {
    try {
      const token = JSON.parse(localStorage.getItem("userInfo")!)?.token;

      const response = await axios.delete(
        `${url}/design/delete-product-components-by-design/${parseInt(productId)}`,
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
export const deleteProductComponentSlice = createSlice({
  name: "deleteProductComponent",
  initialState,
  reducers: {
    resetDeleteProductComponent: () => initialState,
  },
  extraReducers: (builder) => {
    // Delete single
    builder.addCase(deleteProductComponentFn.pending, (state) => {
      state.isLoading = true;
      state.isError = false;
      state.isSuccess = false;
    });
    builder.addCase(deleteProductComponentFn.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.data = action.payload;
    });
    builder.addCase(deleteProductComponentFn.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = Object(action.payload);
    });

    // Delete by design
    builder.addCase(deleteProductComponentsByDesignFn.pending, (state) => {
      state.isLoading = true;
      state.isError = false;
      state.isSuccess = false;
    });
    builder.addCase(deleteProductComponentsByDesignFn.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.data = action.payload;
    });
    builder.addCase(deleteProductComponentsByDesignFn.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = Object(action.payload);
    });
  },
});

export const { resetDeleteProductComponent } = deleteProductComponentSlice.actions;