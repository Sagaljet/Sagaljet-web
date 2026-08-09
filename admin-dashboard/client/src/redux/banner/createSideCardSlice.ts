// redux/slices/sideCard/createSideCardSlice.ts

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

// Async function for creating Side Card
export const createSideCardFn = createAsyncThunk(
  "createSideCard",
  async (data: any, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("label", data.label);
      formData.append("title", data.title);
      formData.append("buttonText", data.buttonText || "Order Now");
      
      if (data.badge) {
        formData.append("badge", data.badge);
      }
      
      if (data.discount) {
        formData.append("discount", data.discount.toString());
      }
      
      if (data.discountType) {
        formData.append("discountType", data.discountType);
      }
      
      formData.append("order", data.order ? data.order.toString() : "0");
      formData.append(
        "isActive",
        data.isActive !== undefined ? data.isActive.toString() : "true"
      );

      if (data.designId) {
        formData.append("designId", data.designId.toString());
      }

      // Append custom image if provided
      if (data.image) {
        formData.append("image", data.image);
      }

      const token = JSON.parse(localStorage.getItem("userInfo")!)?.token;

      const response = await axios.post(`${url}/side-cards/add-side-card`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
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
export const createSideCardSlice = createSlice({
  name: "createSideCard",
  initialState,
  reducers: {
    resetCreateSideCard: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(createSideCardFn.pending, (state) => {
      state.isLoading = true;
      state.isError = false;
      state.isSuccess = false;
    });
    builder.addCase(createSideCardFn.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.data = action.payload;
    });
    builder.addCase(createSideCardFn.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = Object(action.payload);
    });
  },
});

export const { resetCreateSideCard } = createSideCardSlice.actions;