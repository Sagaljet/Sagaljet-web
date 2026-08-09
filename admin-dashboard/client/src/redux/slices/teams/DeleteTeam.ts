import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { errorMess, url } from "../../API";

const initialState = {
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
  data: {},
};

// Async function to delete a team member
export const deleteTeamFn = createAsyncThunk(
  "deleteTeam",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${url}/teams/delete/${id}`);
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
export const deleteTeamSlice = createSlice({
  name: "deleteTeam",
  initialState,
  reducers: {
    deleteTeamReset: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(deleteTeamFn.pending, (state) => {
      state.isLoading = true;
      state.isError = false;
      state.isSuccess = false;
      state.message = ""; // Clear previous errors
    });
    builder.addCase(deleteTeamFn.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.data = action.payload;
    });
    builder.addCase(deleteTeamFn.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = Object(action.payload);
    });
  },
});

export const { deleteTeamReset } = deleteTeamSlice.actions;
