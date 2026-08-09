import { errorMess, url } from "../../API";

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
  data: {},
};

// Async function for sign-up
export const singInFn = createAsyncThunk(
  "singIn",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${url}/user/login`, data);
      return response.data.result;
    } catch (error) {
      if (axios.isAxiosError(error)) {
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
export const singInSlice = createSlice({
  name: "singIn",
  initialState,
  reducers: {
    resetSingIn: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(singInFn.pending, (state) => {
      state.isLoading = true;
      state.isError = false;
      state.isSuccess = false;
      state.message = ""; // Clear previous errors
    });
    builder.addCase(singInFn.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.data = action.payload;
    });
    builder.addCase(singInFn.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = String(action.payload);
    });
  },
});

export const { resetSingIn } = singInSlice.actions;
