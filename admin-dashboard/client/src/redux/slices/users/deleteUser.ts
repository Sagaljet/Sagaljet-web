import { errorMess, url } from "../../API";

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";

const initialState = {
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
};

// Async function for deleting a user
export const deleteUserFn = createAsyncThunk(
  "deleteUser",
  async (userId, { rejectWithValue }) => {
    try {
      const token = JSON.parse(localStorage.getItem("userInfo")!)?.token;

      const response = await axios.delete(`${url}/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
export const deleteUserSlice = createSlice({
  name: "deleteUser",
  initialState,
  reducers: {
    resetDeleteUser: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(deleteUserFn.pending, (state) => {
      state.isLoading = true;
      state.isError = false;
      state.isSuccess = false;
      state.message = ""; // Clear previous errors
    });
    builder.addCase(deleteUserFn.fulfilled, (state, _) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.message = "User deleted successfully";
    });
    builder.addCase(deleteUserFn.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = Object(action.payload);
    });
  },
});

export const { resetDeleteUser } = deleteUserSlice.actions;
