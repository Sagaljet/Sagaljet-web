// redux/slices/banner/deleteBannerSlice.ts

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { errorMess, url } from "../API";
import type { DeleteBannerPayload } from "../types/banner";

interface DeleteBannerState {
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  message: string;
  data: any;
}

const initialState: DeleteBannerState = {
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
  data: {},
};

export const deleteBannerFn = createAsyncThunk(
  "deleteBanner",
  async ({ type, id }: DeleteBannerPayload, { rejectWithValue }) => {
    try {
      const token = JSON.parse(localStorage.getItem("userInfo")!)?.token;

      const response = await axios.delete(`${url}/banners/${type}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return { ...response.data, bannerType: type };
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data?.message || errorMess);
      }
      return rejectWithValue(errorMess);
    }
  }
);

export const deleteBannerSlice = createSlice({
  name: "deleteBanner",
  initialState,
  reducers: {
    deleteBannerReset: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(deleteBannerFn.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
      })
      .addCase(deleteBannerFn.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.data = action.payload;
      })
      .addCase(deleteBannerFn.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = String(action.payload);
      });
  },
});

export const { deleteBannerReset } = deleteBannerSlice.actions;