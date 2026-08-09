// Redux slice for fetching past events

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

// Async function for getting past events
export const getPastEventsFn = createAsyncThunk<any, void>(
  "getPastEvents",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${url}/event/get-past-events`);
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
export const getPastEventsSlice = createSlice({
  name: "getPastEvents",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getPastEventsFn.pending, (state) => {
      state.isLoading = true;
      state.isError = false;
      state.isSuccess = false;
    });
    builder.addCase(getPastEventsFn.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.data = action.payload;
    });
    builder.addCase(getPastEventsFn.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = Object(action.payload);
    });
  },
});