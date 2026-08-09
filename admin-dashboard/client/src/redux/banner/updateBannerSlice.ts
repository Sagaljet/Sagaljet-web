import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { errorMess, url } from "../API";
import type { UpdateBannerPayload } from "../types/banner";

interface UpdateBannerState {
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  message: string;
  data: any;
}

const initialState: UpdateBannerState = {
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
  data: {},
};

export const updateBannerFn = createAsyncThunk(
  "updateBanner",
  async (data: UpdateBannerPayload, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("subtitle", data.subtitle);
      formData.append("label", data.label);

      if (data.url !== undefined) {
        formData.append("url", data.url || "");
      }

      if (data.discount !== null && data.discount !== undefined) {
        formData.append("discount", data.discount.toString());
      }

      if (data.discountType) {
        formData.append("discountType", data.discountType);
      }

      if (data.order !== undefined && data.order !== null) {
        formData.append("order", data.order.toString());
      }

      if (data.isActive !== undefined) {
        formData.append("isActive", data.isActive.toString());
      }

      if (data.image) {
        formData.append("image", data.image);
      }

      const token = JSON.parse(localStorage.getItem("userInfo")!)?.token;

      const response = await axios.put(
        `${url}/banners/${data.type}/${data.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return { ...response.data, bannerType: data.type };
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data?.message || errorMess);
      }
      return rejectWithValue(errorMess);
    }
  }
);

export const updateBannerSlice = createSlice({
  name: "updateBanner",
  initialState,
  reducers: {
    resetUpdateBanner: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateBannerFn.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(updateBannerFn.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.data = action.payload;
      })
      .addCase(updateBannerFn.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = String(action.payload);
      });
  },
});

export const { resetUpdateBanner } = updateBannerSlice.actions;