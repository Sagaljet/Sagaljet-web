import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import type { OrderDesignInput, OrderDesignResponse } from "@/redux/types/orderDesign";
import { errorMess, url } from "@/redux/API";

interface UpdateState {
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  message: string;
  data: OrderDesignResponse | null;
}

const initialState: UpdateState = {
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
  data: null,
};

export const updateOrderDesignFn = createAsyncThunk<
  OrderDesignResponse,
  OrderDesignInput,
  { rejectValue: string }
>(
  "orderDesign/update",
  async (data, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("price", data.price.toString());

      if (data.size !== undefined) {
        formData.append("size", data.size || "");
      }

      if (data.postType) {
        formData.append("postType", data.postType);
      }

      if (data.description !== undefined) {
        formData.append("description", data.description || "");
      }

      // ✅ Append existing images as JSON string
      if (data.existingImages !== undefined) {
        formData.append("existingImages", JSON.stringify(data.existingImages));
      }

      // ✅ Append new images
      if (data.images && data.images.length > 0) {
        data.images.forEach((image) => {
          formData.append("images", image);
        });
      }

      const token = JSON.parse(localStorage.getItem("userInfo") || "{}")?.token;

      const response = await axios.put<OrderDesignResponse>(
        `${url}/order-designs/${data.id}`,
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

export const updateOrderDesignSlice = createSlice({
  name: "updateOrderDesign",
  initialState,
  reducers: {
    resetUpdateOrderDesign: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateOrderDesignFn.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(
        updateOrderDesignFn.fulfilled,
        (state, action: PayloadAction<OrderDesignResponse>) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.data = action.payload;
          state.message = action.payload.message || "Updated successfully";
        }
      )
      .addCase(updateOrderDesignFn.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || errorMess;
      });
  },
});

export const { resetUpdateOrderDesign } = updateOrderDesignSlice.actions;
export default updateOrderDesignSlice.reducer;