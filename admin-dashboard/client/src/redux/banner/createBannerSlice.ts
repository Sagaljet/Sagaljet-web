import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { errorMess, url } from "../API";
import type { CreateBannerPayload } from "../types/banner";

interface CreateBannerState {
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  message: string;
  data: any;
}

const initialState: CreateBannerState = {
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
  data: {},
};

export const createBannerFn = createAsyncThunk(
  "createBanner",
  async (data: CreateBannerPayload, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("subtitle", data.subtitle);
      formData.append("label", data.label);

      if (data.url) {
        formData.append("url", data.url);
      }

      if (data.discount) {
        formData.append("discount", data.discount.toString());
      }

      if (data.discountType) {
        formData.append("discountType", data.discountType);
      }

      formData.append("order", data.order?.toString() || "0");
      formData.append(
        "isActive",
        data.isActive !== undefined ? data.isActive.toString() : "true"
      );

      if (data.image) {
        formData.append("image", data.image);
      }

      const token = JSON.parse(localStorage.getItem("userInfo")!)?.token;

      const response = await axios.post(
        `${url}/banners/${data.type}`,
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

export const createBannerSlice = createSlice({
  name: "createBanner",
  initialState,
  reducers: {
    resetCreateBanner: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(createBannerFn.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
      })
      .addCase(createBannerFn.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.data = action.payload;
      })
      .addCase(createBannerFn.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = String(action.payload);
      });
  },
});

export const { resetCreateBanner } = createBannerSlice.actions;