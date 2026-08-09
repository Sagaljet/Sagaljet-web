// src/redux/slices/orderDesign/getPostTypes.ts

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import type { PostTypeOption } from "../../types/orderDesign";
import { errorMess, url } from "../../API";

interface PostTypesState {
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  message: string;
  data: PostTypeOption[];
}

const initialState: PostTypesState = {
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
  data: [],
};

export const getPostTypesFn = createAsyncThunk(
  "orderDesign/getPostTypes",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${url}/order-designs/post-types`);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data?.message || errorMess);
      }
      return rejectWithValue(errorMess);
    }
  }
);

export const getPostTypesSlice = createSlice({
  name: "getPostTypes",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getPostTypesFn.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getPostTypesFn.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.data = action.payload.result;
      })
      .addCase(getPostTypesFn.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      });
  },
});

export default getPostTypesSlice.reducer;