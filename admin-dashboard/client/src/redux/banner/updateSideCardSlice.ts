// redux/slices/sideCard/updateSideCardSlice.ts

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { errorMess, url } from "../API";

const initialState = {
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
  data: {},
};

export const updateSideCardFn = createAsyncThunk(
  "updateSideCard",
  async (data: any, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("label", data.label);
      formData.append("title", data.title);
      formData.append("buttonText", data.buttonText);

      // Only append badge if it's not null/undefined
      if (
        data.badge !== undefined &&
        data.badge !== null &&
        data.badge !== ""
      ) {
        formData.append("badge", data.badge);
      }

      // Only append discount if it's not null/undefined
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

      // ✅ FIXED: Only append designId if it's not null
      if (data.designId !== undefined && data.designId !== null) {
        formData.append("designId", data.designId.toString());
      }

      // Append new image if provided
      if (data.image) {
        formData.append("image", data.image);
      }

      const token = JSON.parse(localStorage.getItem("userInfo")!)?.token;

      if (!token) {
        return rejectWithValue("No authentication token found");
      }

      console.log("🚀 Updating side card with ID:", data.id);
      console.log("📦 FormData entries:");
      for (let pair of formData.entries()) {
        console.log(pair[0] + ": " + pair[1]);
      }

      const response = await axios.put(
        `${url}/side-cards/edit-side-card/${parseInt(data.id)}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("✅ Update successful:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Update failed:", error);

      if (error instanceof AxiosError) {
        console.error("Axios error details:", {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        });

        if (error.response?.data?.errors) {
          return rejectWithValue(error.response.data.errors);
        }
        if (error.response?.data?.message) {
          return rejectWithValue(error.response.data.message);
        }
        return rejectWithValue(error.message || errorMess);
      }

      return rejectWithValue(errorMess);
    }
  }
);

export const updateSideCardSlice = createSlice({
  name: "updateSideCard",
  initialState,
  reducers: {
    resetUpdateSideCard: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(updateSideCardFn.pending, (state) => {
      state.isLoading = true;
      state.isError = false;
      state.isSuccess = false;
      state.message = ""; // ✅ Clear previous messages
    });
    builder.addCase(updateSideCardFn.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.data = action.payload;
      state.message = ""; // ✅ Clear error messages
    });
    builder.addCase(updateSideCardFn.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = String(action.payload || "An error occurred"); // ✅ Better error handling
    });
  },
});

export const { resetUpdateSideCard } = updateSideCardSlice.actions;
