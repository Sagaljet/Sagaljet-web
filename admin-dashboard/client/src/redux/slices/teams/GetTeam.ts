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

// Async function for fetching teams
export const getTeamFn = createAsyncThunk(
  "getTeam",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${url}/teams/all`);

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
export const getTeamSlice = createSlice({
  name: "getTeam",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getTeamFn.pending, (state) => {
      state.isLoading = true;
      state.isError = false;
      state.isSuccess = false;
      state.message = ""; // Clear previous errors
    });
    builder.addCase(getTeamFn.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.data = action.payload;
    });
    builder.addCase(getTeamFn.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = Object(action.payload);
    });
  },
});
