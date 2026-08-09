// Redux slice for fetching all events

import { errorMess, url } from "../../API";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";

const initialState = {
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
  data: [],
};

// Async function for getting active events
export const getEventsFn = createAsyncThunk<any, void>(
  "getEvents",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${url}/event/get-events`);
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

// Async function for getting all events (including inactive)
export const getAllEventsFn = createAsyncThunk<any, void>(
  "getAllEvents",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${url}/event/get-all-events`);
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
export const getEventsSlice = createSlice({
  name: "getEvents",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Get active events
    builder.addCase(getEventsFn.pending, (state) => {
      state.isLoading = true;
      state.isError = false;
      state.isSuccess = false;
    });
    builder.addCase(getEventsFn.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.data = action.payload;
    });
    builder.addCase(getEventsFn.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = Object(action.payload);
    });

    // Get all events
    builder.addCase(getAllEventsFn.pending, (state) => {
      state.isLoading = true;
      state.isError = false;
      state.isSuccess = false;
    });
    builder.addCase(getAllEventsFn.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.data = action.payload;
    });
    builder.addCase(getAllEventsFn.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = Object(action.payload);
    });
  },
});
