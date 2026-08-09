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

// Async function for sign-up
export const deleteClientFn = createAsyncThunk(
  "deleteClient",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${url}/client/delete/${id}`);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.data?.error) {
          return rejectWithValue(error.response.data.error);
        }
        return rejectWithValue(error.response?.data?.message || errorMess);
      }
      return rejectWithValue(errorMess);
    }
  }
);

// Slice definition
export const deleteClientSlice = createSlice({
  name: "deleteClient",
  initialState,
  reducers: {
    deleteClientReset: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(deleteClientFn.pending, (state) => {
      state.isLoading = true;
      state.isError = false;
      state.isSuccess = false;
    });
    builder.addCase(deleteClientFn.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.data = action.payload;
    });
    builder.addCase(deleteClientFn.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = Object(action.payload);
    });
  },
});

export const { deleteClientReset } = deleteClientSlice.actions;
