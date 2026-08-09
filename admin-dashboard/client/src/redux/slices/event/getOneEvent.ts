// Redux slice for fetching a single event by ID

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

// Async function to get a single event
export const getOneEventFn = createAsyncThunk(
  "getOneEvent",
  async (id: string | number, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${url}/event/get-event/${id}`);
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
export const getOneEventSlice = createSlice({
  name: "getOneEvent",
  initialState,
  reducers: {
    resetGetOneEvent: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(getOneEventFn.pending, (state) => {
      state.isLoading = true;
      state.isError = false;
      state.isSuccess = false;
      state.message = "";
    });
    builder.addCase(getOneEventFn.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.data = action.payload;
    });
    builder.addCase(getOneEventFn.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = Object(action.payload);
    });
  },
});

export const { resetGetOneEvent } = getOneEventSlice.actions;
