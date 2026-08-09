// redux/slices/sideCard/deleteSideCardSlice.ts

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

// Async function for deleting single side card
export const deleteSideCardFn = createAsyncThunk(
  "deleteSideCard",
  async (id: any, { rejectWithValue }) => {
    try {
      const token = JSON.parse(localStorage.getItem("userInfo")!)?.token;

      const response = await axios.delete(
        `${url}/side-cards/delete-side-card/${parseInt(id)}`,
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
export const deleteSideCardSlice = createSlice({
  name: "deleteSideCard",
  initialState,
  reducers: {
    deleteSideCardReset: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(deleteSideCardFn.pending, (state) => {
      state.isLoading = true;
      state.isError = false;
      state.isSuccess = false;
    });
    builder.addCase(deleteSideCardFn.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.data = action.payload;
    });
    builder.addCase(deleteSideCardFn.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = Object(action.payload);
    });
  },
});

export const { deleteSideCardReset } = deleteSideCardSlice.actions;