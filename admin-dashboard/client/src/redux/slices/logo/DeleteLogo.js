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

// Async function for sign-up
export const deleteLogoFn = createAsyncThunk(
  "deleteLogo",
  async (id, { rejectWithValue }) => {
    try {
      const token = JSON.parse(localStorage.getItem("userInfo"))?.token;
      const response = await axios.delete(
        `${url}/logo/delete-logo/${parseInt(id)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
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
export const deleteLogoSlice = createSlice({
  name: "deleteLogo",
  initialState,
  reducers: {
    deleteLogoReset: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(deleteLogoFn.pending, (state) => {
      state.isLoading = true;
      state.isError = false;
      state.isSuccess = false;
      state.message = {}; // Clear previous errors
    });
    builder.addCase(deleteLogoFn.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.data = action.payload;
    });
    builder.addCase(deleteLogoFn.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = action.payload;
    });
  },
});

export const { deleteLogoReset } = deleteLogoSlice.actions;
