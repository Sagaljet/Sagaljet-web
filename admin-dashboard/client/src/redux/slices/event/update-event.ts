// Redux slice for updating a single event

import { errorMess, url } from "../../API";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";

const initialState = {
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
  data: {},
};

// Async function for updating event
export const updateEventFn = createAsyncThunk(
  "updateEvent",
  async (data: any, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description || "");
      formData.append("location", data.location || "");
      formData.append("startAt", data.startAt);
      formData.append("endAt", data.endAt || "");
      formData.append("isActive", data.isActive);

      if (data.imageUrl) {
        formData.append("imageUrl", data.imageUrl);
      }

      const response = await axios.put(
        `${url}/event/edit-event/${parseInt(data.id)}`,
        formData
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
export const updateEventSlice = createSlice({
  name: "updateEvent",
  initialState,
  reducers: {
    resetUpdateEvent: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(updateEventFn.pending, (state) => {
      state.isLoading = true;
      state.isError = false;
      state.isSuccess = false;
    });
    builder.addCase(updateEventFn.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.data = action.payload;
    });
    builder.addCase(updateEventFn.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = Object(action.payload);
    });
  },
});

export const { resetUpdateEvent } = updateEventSlice.actions;
