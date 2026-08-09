// Redux slice for toggling event active/inactive status

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

// Async function for toggling event status
export const toggleEventStatusFn = createAsyncThunk(
  "toggleEventStatus",
  async (id: string | number, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${url}/event/toggle-event-status/${id}`
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
export const toggleEventStatusSlice = createSlice({
  name: "toggleEventStatus",
  initialState,
  reducers: {
    resetToggleEventStatus: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(toggleEventStatusFn.pending, (state) => {
      state.isLoading = true;
      state.isError = false;
      state.isSuccess = false;
    });
    builder.addCase(toggleEventStatusFn.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.data = action.payload;
      state.message = action.payload.message || "Status updated successfully";
    });
    builder.addCase(toggleEventStatusFn.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = Object(action.payload);
    });
  },
});

export const { resetToggleEventStatus } = toggleEventStatusSlice.actions;
