// Redux slice for fetching upcoming events

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

// Async function for getting upcoming events
export const getUpcomingEventsFn = createAsyncThunk<any, void>(
  "getUpcomingEvents",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${url}/event/get-upcoming-events`);
      return response.data.result;
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
export const getUpcomingEventsSlice = createSlice({
  name: "getUpcomingEvents",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getUpcomingEventsFn.pending, (state) => {
      state.isLoading = true;
      state.isError = false;
      state.isSuccess = false;
    });
    builder.addCase(getUpcomingEventsFn.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.data = action.payload;
    });
    builder.addCase(getUpcomingEventsFn.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = Object(action.payload);
    });
  },
});