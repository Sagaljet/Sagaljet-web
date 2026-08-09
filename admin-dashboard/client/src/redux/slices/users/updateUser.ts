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

// Async function for updating a user
export const updateUserFn = createAsyncThunk(
  "updateUser",
  async (data: any, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("avatar", data.avatar);
      formData.append("name", data.name);
      formData.append("email", data.email);

      const token = JSON.parse(localStorage.getItem("userInfo")!)?.token;

      const response = await axios.put(`${url}/user/${data.id}`, formData, {
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
export const updateUserSlice = createSlice({
  name: "updateUser",
  initialState,
  reducers: {
    resetUpdateUser: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(updateUserFn.pending, (state) => {
      state.isLoading = true;
      state.isError = false;
      state.isSuccess = false;
    });
    builder.addCase(updateUserFn.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.data = action.payload;
    });
    builder.addCase(updateUserFn.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = Object(action.payload);
    });
  },
});

export const { resetUpdateUser } = updateUserSlice.actions;
