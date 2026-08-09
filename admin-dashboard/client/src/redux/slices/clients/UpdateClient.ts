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
export const updateClientFn = createAsyncThunk(
  "updateClient",
  async (data: any, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("logoUrl", data.logoUrl);
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("id", data.id);

      const response = await axios.put(`${url}/client/update`, formData);
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
export const updateClientSlice = createSlice({
  name: "updateClient",
  initialState,
  reducers: {
    resetUpdateClient: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(updateClientFn.pending, (state) => {
      state.isLoading = true;
      state.isError = false;
      state.isSuccess = false;
    });
    builder.addCase(updateClientFn.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.data = action.payload;
    });
    builder.addCase(updateClientFn.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = Object(action.payload);
    });
  },
});

export const { resetUpdateClient } = updateClientSlice.actions;
