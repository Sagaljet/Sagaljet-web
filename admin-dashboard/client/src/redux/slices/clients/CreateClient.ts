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
export const createClientFn = createAsyncThunk(
  "createClient",
  async (data: any, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("logoUrl", data.logoUrl);
      formData.append("name", data.name);
      formData.append("description", data.description);

      const token = JSON.parse(localStorage.getItem("userInfo")!)?.token;

      const response = await axios.post(`${url}/client/new`, formData, {
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
export const createClientSlice = createSlice({
  name: "createClient",
  initialState,
  reducers: {
    resetCreateClient: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(createClientFn.pending, (state) => {
      state.isLoading = true;
      state.isError = false;
      state.isSuccess = false;
    });
    builder.addCase(createClientFn.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.data = action.payload;
    });
    builder.addCase(createClientFn.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = Object(action.payload);
    });
  },
});

export const { resetCreateClient } = createClientSlice.actions;
