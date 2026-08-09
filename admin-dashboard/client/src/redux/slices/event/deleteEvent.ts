// Redux slice for deleting single or multiple events

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

// Async function for deleting single event
export const deleteEventFn = createAsyncThunk(
  "deleteEvent",
  async (id: any, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${url}/event/delete-event/${parseInt(id)}`
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

// Async function for deleting multiple events
export const deleteEventsFn = createAsyncThunk(
  "deleteEvents",
  async (ids: number[], { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${url}/event/delete-events`, {
        data: { ids },
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
export const deleteEventSlice = createSlice({
  name: "deleteEvent",
  initialState,
  reducers: {
    deleteEventReset: () => initialState,
  },
  extraReducers: (builder) => {
    // Delete single event
    builder.addCase(deleteEventFn.pending, (state) => {
      state.isLoading = true;
      state.isError = false;
      state.isSuccess = false;
    });
    builder.addCase(deleteEventFn.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.data = action.payload;
    });
    builder.addCase(deleteEventFn.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = Object(action.payload);
    });

    // Delete multiple events
    builder.addCase(deleteEventsFn.pending, (state) => {
      state.isLoading = true;
      state.isError = false;
      state.isSuccess = false;
    });
    builder.addCase(deleteEventsFn.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.data = action.payload;
    });
    builder.addCase(deleteEventsFn.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = Object(action.payload);
    });
  },
});

export const { deleteEventReset } = deleteEventSlice.actions;
