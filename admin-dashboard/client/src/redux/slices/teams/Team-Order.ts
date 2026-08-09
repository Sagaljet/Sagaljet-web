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

export const updateTeamOrderFn = createAsyncThunk(
  "team/updateOrder",
  async (newOrder, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${url}/teams/order`, { newOrder });
      return response.data.message;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data?.message || errorMess);
      }
      return rejectWithValue(errorMess);
    }
  }
);

// Slice definition
export const updateOrderTeam = createSlice({
  name: "team",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // ✅ Update order handlers
    builder
      .addCase(updateTeamOrderFn.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = "";
      })
      .addCase(updateTeamOrderFn.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
        // optionally, you could refetch data via getTeamFn
      })
      .addCase(updateTeamOrderFn.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = Object(action.payload);
      });
  },
});
