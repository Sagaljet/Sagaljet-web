// redux/slices/banner/getBannersSlice.ts

import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { errorMess, url } from "../API";
import type { Banner, BannerType, GetBannersPayload } from "../types/banner";

interface BannerState {
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  message: string;
  data: Banner[];
  currentType: BannerType | null;
}

const initialState: BannerState = {
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
  data: [],
  currentType: null,
};

// Get active banners by type (public)
export const getBannersFn = createAsyncThunk<
  { banners: Banner[]; type: BannerType },
  GetBannersPayload
>("getBanners", async ({ type }, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${url}/banners/${type}/active`);
    return { banners: response.data.result, type };
  } catch (error) {
    if (error instanceof AxiosError) {
      return rejectWithValue(error.response?.data?.message || errorMess);
    }
    return rejectWithValue(errorMess);
  }
});

// Get all banners by type (admin)
export const getAllBannersFn = createAsyncThunk<
  { banners: Banner[]; type: BannerType },
  GetBannersPayload
>("getAllBanners", async ({ type }, { rejectWithValue }) => {
  try {
    const token = JSON.parse(localStorage.getItem("userInfo")!)?.token;

    const response = await axios.get(`${url}/banners/${type}/all`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return { banners: response.data.result, type };
  } catch (error) {
    if (error instanceof AxiosError) {
      return rejectWithValue(error.response?.data?.message || errorMess);
    }
    return rejectWithValue(errorMess);
  }
});

// Get single banner
export const getBannerFn = createAsyncThunk<
  Banner,
  { type: BannerType; id: number }
>("getBanner", async ({ type, id }, { rejectWithValue }) => {
  try {
    const token = JSON.parse(localStorage.getItem("userInfo")!)?.token;

    const response = await axios.get(`${url}/banners/${type}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.result;
  } catch (error) {
    if (error instanceof AxiosError) {
      return rejectWithValue(error.response?.data?.message || errorMess);
    }
    return rejectWithValue(errorMess);
  }
});

export const getBannersSlice = createSlice({
  name: "getBanners",
  initialState,
  reducers: {
    resetGetBanners: () => initialState,
    setCurrentType: (state, action: PayloadAction<BannerType>) => {
      state.currentType = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Get active banners
    builder
      .addCase(getBannersFn.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
      })
      .addCase(getBannersFn.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.data = action.payload.banners;
        state.currentType = action.payload.type;
      })
      .addCase(getBannersFn.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = String(action.payload);
      });

    // Get all banners
    builder
      .addCase(getAllBannersFn.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
      })
      .addCase(getAllBannersFn.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.data = action.payload.banners;
        state.currentType = action.payload.type;
      })
      .addCase(getAllBannersFn.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = String(action.payload);
      });

    // Get single banner
    builder
      .addCase(getBannerFn.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
      })
      .addCase(getBannerFn.fulfilled, (state, _) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(getBannerFn.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = String(action.payload);
      });
  },
});

export const { resetGetBanners, setCurrentType } = getBannersSlice.actions;