// Redux slice for fetching a single product component by ID

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

// Async function to get a single product component by ID
export const getOneProductComponentFn = createAsyncThunk(
  "getOneProductComponent",
  async (id: string | number, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${url}/design/get-product-component/${id}`
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
export const getOneProductComponentSlice = createSlice({
  name: "getOneProductComponent",
  initialState,
  reducers: {
    resetGetOneProductComponent: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(getOneProductComponentFn.pending, (state) => {
      state.isLoading = true;
      state.isError = false;
      state.isSuccess = false;
      state.message = "";
    });
    builder.addCase(getOneProductComponentFn.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.data = action.payload;
    });
    builder.addCase(getOneProductComponentFn.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = Object(action.payload);
    });
  },
});

export const { resetGetOneProductComponent } = getOneProductComponentSlice.actions;