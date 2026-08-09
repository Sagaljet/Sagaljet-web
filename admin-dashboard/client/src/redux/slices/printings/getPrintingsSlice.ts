import { errorMess, url } from "@/redux/API";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";

const initialState = {
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
  data: [],
};

// Async function for getting all Printings
export const getPrintingsFn = createAsyncThunk(
  "getPrintings",
  async (_, { rejectWithValue }) => {
    try {
      const token = JSON.parse(localStorage.getItem("userInfo")!)?.token;

      const response = await axios.get(`${url}/printings`, {
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
export const getPrintingsSlice = createSlice({
  name: "getPrintings",
  initialState,
  reducers: {
    resetGetPrintings: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(getPrintingsFn.pending, (state) => {
      state.isLoading = true;
      state.isError = false;
      state.isSuccess = false;
    });
    builder.addCase(getPrintingsFn.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.data = action.payload.result || action.payload;
    });
    builder.addCase(getPrintingsFn.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = Object(action.payload);
    });
  },
});

export const { resetGetPrintings } = getPrintingsSlice.actions;