// src/redux/slices/orderDesign/getOrderDesign.ts

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import type { OrderDesign } from "../../types/orderDesign";
import { errorMess, url } from "../../API";

interface GetOneState {
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  message: string;
  data: OrderDesign | null;
}

const initialState: GetOneState = {
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
  data: null,
};

export const getOrderDesignFn = createAsyncThunk(
  "orderDesign/getOne",
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${url}/order-designs/${id}`);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data?.message || errorMess);
      }
      return rejectWithValue(errorMess);
    }
  }
);

export const getOrderDesignSlice = createSlice({
  name: "getOrderDesign",
  initialState,
  reducers: {
    resetGetOrderDesign: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getOrderDesignFn.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
      })
      .addCase(getOrderDesignFn.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.data = action.payload.result;
      })
      .addCase(getOrderDesignFn.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      });
  },
});

export const { resetGetOrderDesign } = getOrderDesignSlice.actions;
export default getOrderDesignSlice.reducer;