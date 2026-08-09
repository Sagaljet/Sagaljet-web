// Redux slice for toggling design printable status

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

// Async function for toggling design printable status
export const toggleDesignPrintableFn = createAsyncThunk(
  "toggleDesignPrintable",
  async (id: string | number, { rejectWithValue }) => {
    try {
      const token = JSON.parse(localStorage.getItem("userInfo")!)?.token;

      const response = await axios.put(
        `${url}/design/toggle-design-printable/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
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
export const toggleDesignPrintableSlice = createSlice({
  name: "toggleDesignPrintable",
  initialState,
  reducers: {
    resetToggleDesignPrintable: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(toggleDesignPrintableFn.pending, (state) => {
      state.isLoading = true;
      state.isError = false;
      state.isSuccess = false;
    });
    builder.addCase(toggleDesignPrintableFn.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.data = action.payload;
    });
    builder.addCase(toggleDesignPrintableFn.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = Object(action.payload);
    });
  },
});

export const { resetToggleDesignPrintable } = toggleDesignPrintableSlice.actions;