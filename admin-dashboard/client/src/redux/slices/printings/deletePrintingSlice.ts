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

// Async function for deleting Printing
export const deletePrintingFn = createAsyncThunk(
  "deletePrinting",
  async (id: number, { rejectWithValue }) => {
    try {
      const token = JSON.parse(localStorage.getItem("userInfo")!)?.token;

      const response = await axios.delete(`${url}/printing/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
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
export const deletePrintingSlice = createSlice({
  name: "deletePrinting",
  initialState,
  reducers: {
    resetDeletePrinting: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(deletePrintingFn.pending, (state) => {
      state.isLoading = true;
      state.isError = false;
      state.isSuccess = false;
    });
    builder.addCase(deletePrintingFn.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.data = action.payload;
    });
    builder.addCase(deletePrintingFn.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = Object(action.payload);
    });
  },
});

export const { resetDeletePrinting } = deletePrintingSlice.actions;