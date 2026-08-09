// src/redux/slices/orderDesign/deleteOrderDesign.ts

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { errorMess, url } from "../../API";

interface DeleteState {
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  message: string;
}

const initialState: DeleteState = {
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
};

export const deleteOrderDesignFn = createAsyncThunk(
  "orderDesign/delete",
  async (id: number, { rejectWithValue }) => {
    try {
      const token = JSON.parse(localStorage.getItem("userInfo") || "{}")?.token;

      const response = await axios.delete(`${url}/order-designs/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data?.message || errorMess);
      }
      return rejectWithValue(errorMess);
    }
  }
);

export const deleteOrderDesignSlice = createSlice({
  name: "deleteOrderDesign",
  initialState,
  reducers: {
    resetDeleteOrderDesign: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(deleteOrderDesignFn.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(deleteOrderDesignFn.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = action.payload.message || "Deleted successfully";
      })
      .addCase(deleteOrderDesignFn.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      });
  },
});

export const { resetDeleteOrderDesign } = deleteOrderDesignSlice.actions;
export default deleteOrderDesignSlice.reducer;