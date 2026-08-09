// src/redux/slices/orderDesign/getAllOrderDesigns.ts

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import type { OrderDesign, PaginationInfo } from "../../types/orderDesign";
import { errorMess, url } from "../../API";

interface GetAllState {
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  message: string;
  data: OrderDesign[];
  pagination: PaginationInfo | null;
}

const initialState: GetAllState = {
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
  data: [],
  pagination: null,
};

interface GetAllParams {
  page?: number;
  limit?: number;
  search?: string;
  postType?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export const getAllOrderDesignsFn = createAsyncThunk(
  "orderDesign/getAll",
  async (params: GetAllParams = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append("page", params.page.toString());
      if (params.limit) queryParams.append("limit", params.limit.toString());
      if (params.search) queryParams.append("search", params.search);
      if (params.postType) queryParams.append("postType", params.postType);
      if (params.sortBy) queryParams.append("sortBy", params.sortBy);
      if (params.sortOrder) queryParams.append("sortOrder", params.sortOrder);

      const response = await axios.get(
        `${url}/order-designs?${queryParams.toString()}`
      );

      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data?.message || errorMess);
      }
      return rejectWithValue(errorMess);
    }
  }
);

export const getAllOrderDesignsSlice = createSlice({
  name: "getAllOrderDesigns",
  initialState,
  reducers: {
    resetGetAllOrderDesigns: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllOrderDesignsFn.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
      })
      .addCase(getAllOrderDesignsFn.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.data = action.payload.result;
        state.pagination = action.payload.pagination;
      })
      .addCase(getAllOrderDesignsFn.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      });
  },
});

export const { resetGetAllOrderDesigns } = getAllOrderDesignsSlice.actions;
export default getAllOrderDesignsSlice.reducer;