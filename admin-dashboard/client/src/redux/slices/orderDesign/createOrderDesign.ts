// src/redux/slices/orderDesign/createOrderDesign.ts

import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import type { OrderDesignInput, OrderDesignResponse } from "@/redux/types/orderDesign";
import { errorMess, url } from "@/redux/API";

interface CreateState {
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  message: string;
  data: OrderDesignResponse | null;
}

const initialState: CreateState = {
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
  data: null,
};

export const createOrderDesignFn = createAsyncThunk<
  OrderDesignResponse,
  OrderDesignInput,
  { rejectValue: string }
>(
  "orderDesign/create",
  async (data, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("price", data.price.toString());

      if (data.size) {
        formData.append("size", data.size);
      }

      if (data.postType) {
        formData.append("postType", data.postType);
      }

      if (data.description) {
        formData.append("description", data.description);
      }

      // ✅ Append multiple images
      if (data.images && data.images.length > 0) {
        data.images.forEach((image) => {
          formData.append("images", image);
        });
      }

      const token = JSON.parse(localStorage.getItem("userInfo") || "{}")?.token;

      const response = await axios.post<OrderDesignResponse>(
        `${url}/order-designs`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
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

export const createOrderDesignSlice = createSlice({
  name: "createOrderDesign",
  initialState,
  reducers: {
    resetCreateOrderDesign: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrderDesignFn.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(
        createOrderDesignFn.fulfilled,
        (state, action: PayloadAction<OrderDesignResponse>) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.data = action.payload;
          state.message = action.payload.message || "Created successfully";
        }
      )
      .addCase(createOrderDesignFn.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || errorMess;
      });
  },
});

export const { resetCreateOrderDesign } = createOrderDesignSlice.actions;
export default createOrderDesignSlice.reducer;