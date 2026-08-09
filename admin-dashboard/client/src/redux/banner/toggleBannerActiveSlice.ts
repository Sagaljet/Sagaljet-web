import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { errorMess, url } from "../API";
import type { ToggleBannerPayload } from "../types/banner";

interface ToggleBannerState {
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  message: string;
  data: any;
}

const initialState: ToggleBannerState = {
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
  data: {},
};

export const toggleBannerActiveFn = createAsyncThunk(
  "toggleBannerActive",
  async ({ type, id }: ToggleBannerPayload, { rejectWithValue }) => {
    try {
      const token = JSON.parse(localStorage.getItem("userInfo")!)?.token;

      const response = await axios.patch(
        `${url}/banners/${type}/${id}/toggle`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return { ...response.data, bannerType: type };
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data?.message || errorMess);
      }
      return rejectWithValue(errorMess);
    }
  }
);

export const toggleBannerActiveSlice = createSlice({
  name: "toggleBannerActive",
  initialState,
  reducers: {
    resetToggleBannerActive: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(toggleBannerActiveFn.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
      })
      .addCase(toggleBannerActiveFn.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.data = action.payload;
      })
      .addCase(toggleBannerActiveFn.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = String(action.payload);
      });
  },
});

export const { resetToggleBannerActive } = toggleBannerActiveSlice.actions;